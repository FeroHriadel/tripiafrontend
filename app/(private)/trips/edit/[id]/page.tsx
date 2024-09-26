'use client'

import React, { useEffect, useState } from 'react'
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
import Collapse from '@/components/Collapse'
import TripDetails from '@/components/TripDetails'
import { Trip } from '@/types'
import { resizeImage, uploadImage } from '@/utils/imageUpload'
import { useAuth } from '@/context/authContext'
import { useToast } from '@/context/toastContext'
import { apiCalls } from '@/utils/apiCalls'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'




type CustomChangeEvent = any;



const defaultTripState: Trip = {name: '', departureDate: '', departureTime: '',  departureFrom: '', destination: '', description: '', image: '', requirements: '', category: '', keyWords: '', meetingLat: null, meetingLng: null, destinationLat: null, destinationLng: null};

const tripImageMaxSize = 1000;



const PostTripPage = () => {
  const [trip, setTrip] = useState<Trip>({...defaultTripState});
  const { name, departureDate, departureTime, departureFrom, destination, description, image, requirements, category, keyWords, meetingLat, meetingLng, destinationLat, destinationLng } = trip;
  const [loading, setLoading] = useState(true);
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);
  const [preview, setPreview] = React.useState<string>('');
  const [fileName, setFileName] = React.useState<string>('');
  const { showToast } = useToast();
  const router = useRouter();
  const { user } = useAuth(); const { idToken } = user;
  const { id } = useParams();


  function isTripOk() {
    if (!name) { showToast('Please enter trip name'); return false }
    if (!departureDate) { showToast('Please enter departure date (What day will you be leaving)'); return false }
    if (!departureTime) { showToast('Please enter departure time (What time will you be leaving)'); return false }
    if (!isValidTimeFormat(departureTime)) { showToast('Please enter time in this format: hh:mm (E.g.: 07:30 or 19:15)'); return false }
    if (!isAtLeast4HoursFromNow(departureDate, departureTime)) { showToast('Departure date & time must be at least 4 hours from now'); return false }
    if (!departureFrom) { showToast('Please enter departure from (Where will you be leaving from)'); return false }
    if (!destination) { showToast('Please enter destination (What you are going to see)'); return false }
    if (!description) { showToast('Please enter description (So people know what to expect)'); return false }
    if (keyWords && !checkKeyWords(keyWords)) { showToast('keywords should be 2 - 15 chars each'); return false }
    return true;
  }

  function checkKeyWords(keywords: string): boolean {
    let trimmed = trimAndRemoveTrailingComma(keywords);
    if (trimmed.includes(',')) {
      const parts = trimmed.split(',').map(part => part.trim());
      return parts.every(part => part.length >= 2 && part.length <= 15);
    } else {
      return trimmed.length >= 2 && trimmed.length <= 15;
    }
  }

  function trimAndRemoveTrailingComma(input: string): string {
    let trimmed = input.trim();
    if (trimmed.endsWith(',')) { trimmed = trimmed.slice(0, -1).trim(); }
    return trimmed;
  }
  
  async function updateTrip(trip: Trip) {
    setLoading(true); showToast('Saving changes...');
    const body = {...trip, keyWords: trimAndRemoveTrailingComma(keyWords || '')};
    const res = apiCalls.put(`/trips/${trip.id}`, body);
    return res;
  }

  function handleSuccess() {
    setPreview('');
    setFileName('');
    setLoading(false);
    showToast('Trip saved successfully. Redirecting...');
    setTimeout(() => router.push('/profile/trips'), 1000);
  }

  function handleFail(message: string) {
    setLoading(false);
    showToast(message);
  }

  async function uploadPreview() {
    setLoading(true);
    showToast('Uploading image...');
    const res = await uploadImage(fileName, preview, idToken); 
    return res;
  }

  function handlePreSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    if (!isTripOk()) return; 
    setLoading(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    handlePreSubmit(e);
    let updatedTrip = { ...trip };
    if (preview && preview !== trip.image) {
      const res = await uploadPreview(); if (res.error) return handleFail('Failed to upload image');
      updatedTrip.image = res.imageUrl;
    }
    const res = await updateTrip(updatedTrip);
    if (!res.id) return handleFail(res.error || 'Something went wrong');
    else handleSuccess();
  }

  function handleChange(e:  CustomChangeEvent) {
    if (e.name === 'meetingCoords') {
      const { meetingLat, meetingLng } = e.value;
      setTrip({ ...trip, meetingLat: Number(meetingLat), meetingLng: Number(meetingLng) });
    } else if (e.name === 'destinationCoords') {
      const { destinationLat, destinationLng } = e.value;
      setTrip({ ...trip, destinationLat: Number(destinationLat), destinationLng: Number(destinationLng) });
    } else {
      setTrip({ ...trip, [e.target.name]: e.target.value });
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];
    const resizedImage = await resizeImage(file, tripImageMaxSize);
    if (resizedImage.error) return showToast(resizedImage.error);
    else { setPreview(resizedImage.base64); setFileName(file.name) };
  }

  function toggleMoreDetails() {
    setMoreDetailsOpen(!moreDetailsOpen);
    // if (moreDetailsOpen) setTrip({...trip, requirements: '', category: '', image: '', keyWords: ''}); //clear moreDetails when user closes moreDetails section
  }

  function canBeEdited(trip: Trip) { 
    if (!user.isAdmin) { 
      if (user.email !== trip.createdBy) {
        //no toast shown
        return false;
      }
    }
    if (!isAtLeast4HoursFromNow(trip.departureDate, trip.departureTime)) {
      showToast('Cannot edit trip that is less than 4 hours away');
      return false;
    }
    return true;
  };

  async function getTripById() {
    const res = await apiCalls.get(`/trips?id=${id}`);
    if (res.error) { showToast('Failed to fetch trip. Redirecting...'); return router.push('/profile/trips') }
    else {
      if (!canBeEdited(res)) return router.push('/profile/trips');
      setTrip(res);
      setLoading(false);
    }
  }


  useEffect(() => { getTripById(); }, []); //get trip on page load

  useEffect(() => { if (image) setPreview(image)  }, [image]); //populate imagePreview in <TripDetails />


  if (loading) return <p className='mt-20 text-center'>Loading...</p>

  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='EDIT TRIP' className='text-center mb-4' />
          <GradientDescription text={`Need to change some details? Edit your Trip here.`} className='drop-shadow-lg text-center' />
        </Container>
      </GradientFlexi>

      {
        trip?.id
        &&
        <ContentSection>
          <Container className='px-4'>
            <ContentSectionHeader text='Edit Your Trip' />
            <ContentSectionDescription text='Change any details and re-submit' className='mb-20'/>
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
                <TripDetails loading={loading} handleChange={handleChange} handleImageChange={handleImageChange} imagePreview={preview} trip={trip} />
              </Collapse>
              <ContentSectionButton type='submit' text='Submit' disabled={loading} className='mb-4' />
            </form>
          </Container>
        </ContentSection>
      }

      <GradientFlexi />
    </>
  )
}

export default PostTripPage