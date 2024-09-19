'use client'

import React, { useState } from 'react'
import Container from '@/components/Container'
import ContentSection from '@/components/ContentSection'
import ContentSectionDescription from '@/components/ContentSectionDescription'
import ContentSectionHeader from '@/components/ContentSectionHeader'
import GradientDescription from '@/components/GradientDescription'
import GradientFlexi from '@/components/GradientFlexi'
import GradientHeader from '@/components/GradientHeader'
import InputText from '@/components/InputText'
import InputSelect from '@/components/InputSelect'
import InputTextarea from '@/components/InputTextarea'
import ContentSectionButton from '@/components/ContentSectionButton'
import { getNext14Days, isValidTimeFormat, isAtLeast4HoursFromNow } from '@/utils/dates'
import { useToast } from '@/context/toastContext'
import { apiCalls } from '@/utils/apiCalls'
import { useRouter } from 'next/navigation'
import Collapse from '@/components/Collapse'
import TripDetails from '@/components/TripDetails'
import { TripInput } from '@/types'
import { resizeImage } from '@/utils/imageUpload'



type CustomChangeEvent = any


const defaultTripState: TripInput = {name: '', departureDate: '', departureTime: '',  departureFrom: '', destination: '', description: '', image: '', requirements: '', category: '', keyWords: '', meetingLat: null, meetingLng: null};



const PostTripPage = () => {
  const [trip, setTrip] = useState<TripInput>({...defaultTripState});
  const { name, departureDate, departureTime, departureFrom, destination, description, image, requirements, category, keyWords, meetingLat, meetingLng } = trip;
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);

  
  function isTripOk() {
    if (!name) { showToast('Please enter trip name'); return false }
    if (!departureDate) { showToast('Please enter departure date (What day will you be leaving)'); return false }
    if (!departureTime) { showToast('Please enter departure time (What time will you be leaving)'); return false }
    if (!isValidTimeFormat(departureTime)) { showToast('Please enter time in this format: hh:mm (E.g.: 07:30 or 19:15)'); return false }
    if (!isAtLeast4HoursFromNow(departureDate, departureTime)) { showToast('Departure date & time must be at least 4 hours from now'); return false }
    if (!departureFrom) { showToast('Please enter departure from (Where will you be leaving from)'); return false }
    if (!destination) { showToast('Please enter destination (What you are going to see)'); return false }
    if (!description) { showToast('Please enter description (So people know what to expect)'); return false }
    return true;
  }

  async function addTrip() {
    const res = apiCalls.post(`/trips`, {...trip});
    return res;
  }

  function handleSuccess() {
    setTrip({...defaultTripState});
    setLoading(false);
    showToast('Trip posted successfully. Redirecting...');
    setTimeout(() => router.push('/trips'), 1000);
  }

  function handleFail(message: string) {
    setLoading(false);
    showToast(message);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);
    if (!isTripOk()) return setLoading(false);
    const res = await addTrip();
    if (!res.id) return handleFail(res.error || 'Something went wrong');
    else handleSuccess();
  }

  function handleChange(e:  CustomChangeEvent) {
    if (e.name === 'coords') {
      const { meetingLat, meetingLng } = e.value;
      setTrip({ ...trip, meetingLat: Number(meetingLat), meetingLng: Number(meetingLng) });
    } else {
      setTrip({ ...trip, [e.target.name]: e.target.value });
    }
  }

  function toggleMoreDetails() {
    setMoreDetailsOpen(!moreDetailsOpen);
    setTrip({...trip, requirements: '', category: '', image: '', keyWords: ''})
  }


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='POST A TRIP' className='text-center mb-4' />
          <GradientDescription text={`Are you planning on going somewhere? Would like to invite fellow travelers? Post your trip.`} className='drop-shadow-lg text-center' />
          <GradientDescription text={`Say when, where from and where to and find people to share your adventure with.`} className='drop-shadow-lg text-center' />
          <GradientDescription text={`Add more details to ensure best match.`} className='drop-shadow-lg text-center' />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='Post Your Trip' />
          <ContentSectionDescription text='Fill in the details before you post' className='mb-20'/>
        </Container>
        <Container className='max-w-[500px] px-4'>
          <form onSubmit={handleSubmit}>
            <InputText inputName='name' labelText='trip name' value={name} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputSelect inputName='departureDate' labelText='departure date' value={departureDate} onChange={handleChange} options={getNext14Days()} disabled={loading} className='mb-4' />
            <InputText inputName='departureTime' labelText='departure time (hh:mm)' value={departureTime} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputText inputName='departureFrom' labelText='departure from' value={departureFrom} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputText inputName='destination' labelText='destination' value={destination} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputTextarea inputName='description' labelText='description' value={description} onChange={handleChange} disabled={loading} className='mb-4'/>
            <ContentSectionButton type='button' text={moreDetailsOpen ? 'Close Details' : 'Add More Details'} disabled={loading} onClick={toggleMoreDetails} className='mb-4' />
            <Collapse isOpen={moreDetailsOpen} className='rounded-2xl'>
              <TripDetails loading={loading} handleChange={handleChange} trip={trip} />
            </Collapse>
            <ContentSectionButton type='submit' text='Post Trip' disabled={loading} className='mb-4' />
          </form>
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default PostTripPage