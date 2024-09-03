'use client'

import { useState } from 'react'
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
import React from 'react'
import { getNext14Days, isValidTimeFormat} from '@/utils/dates'
import { useToast } from '@/context/toastContext'
import { apiCalls } from '@/utils/apiCalls'
import { useRouter } from 'next/navigation'



const PostTripPage = () => {
  const [trip, setTrip] = useState({name: '', departureDate: '', departureTime: '',  departureFrom: '', destination: '', description: ''});
  const { name, departureDate, departureTime, departureFrom, destination, description } = trip;
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  function isTripOk() {
    if (!name) { showToast('Please enter trip name'); return false }
    if (!departureDate) { showToast('Please enter departure date (What day will you be leaving)'); return false }
    if (!departureTime) { showToast('Please enter departure time (What time will you be leaving)'); return false }
    if (!isValidTimeFormat(departureTime)) { showToast('Please enter time in this format: hh:mm (E.g.: 07:30 or 19:15)'); return false }
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
    setTrip({name: '', departureDate: '', departureTime: '',  departureFrom: '', destination: '', description: ''});
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  }

  function handleDate(e: any) {
    setTrip({...trip, departureDate: e});
  }


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='POST A TRIP' className='md:translate-y-10 translate-y-7 translate-x-10 lg:-translate-x-10' />
          <GradientDescription text={`Are you planning on going somewhere? Would like to invite fellow travelers? Post your trip.`} className='drop-shadow-lg text-center' />
          <GradientDescription text={`Say when, where from and where to and find people to share your adventure with.`} className='drop-shadow-lg text-center' />
          <GradientDescription text={`Add more details to ensure best match.`} className='drop-shadow-lg text-center' />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='max-w-[500px] px-4'>
          <ContentSectionHeader text='Post Your Trip' />
          <ContentSectionDescription text='Fill in the details before you post' className='mb-20'/>
          <form onSubmit={handleSubmit}>
            <InputText inputName='name' labelText='trip name' value={name} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputSelect inputName='departureDate' labelText='departure date' value={departureDate} onChange={handleDate} options={getNext14Days()} disabled={loading} className='mb-4' />
            <InputText inputName='departureTime' labelText='departure time (hh:mm)' value={departureTime} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputText inputName='departureFrom' labelText='departure from' value={departureFrom} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputText inputName='destination' labelText='destination' value={destination} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputTextarea inputName='description' labelText='description' value={description} onChange={handleChange} disabled={loading} className='mb-4'/>
            <ContentSectionButton type="button" text="Add More Details" disabled={loading} className='mb-4' />
            <ContentSectionButton type="submit" text="Post Trip" disabled={loading} className='mb-4' />
          </form>
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default PostTripPage