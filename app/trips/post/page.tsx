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
import React from 'react'
import InputSelect from '@/components/InputSelect'
import { getNext14Days } from '@/utils/dates'



const PostTripPage = () => {
  const [trip, setTrip] = useState({name: '', departureDate: '', departureTime: '',  departureFrom: '', destination: '', description: ''});
  const { name, departureDate, departureTime, departureFrom, destination, description } = trip;


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
            <InputText inputName='name' labelText='trip name' value={name} onChange={handleChange} className='mb-4' />
            <InputSelect inputName='date' labelText='departure date' value={departureDate} onChange={handleDate} options={getNext14Days()} className='mb-4' />
            <InputText inputName='name' labelText='trip name' value={name} onChange={handleChange} className='mb-4' />
            <InputText inputName='name' labelText='trip name' value={name} onChange={handleChange} className='mb-4' />
          </form>
        </Container>
      </ContentSection>
    </>
  )
}

export default PostTripPage