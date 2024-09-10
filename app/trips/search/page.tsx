'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import GradientButtonPurpleGray from '@/components/GradientButtonPurpleGray';
import GradientButtonPurpleOrange from '@/components/GradientButtonPurpleOrange';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import ContentSectionButton from '@/components/ContentSectionButton';
import InputText from '@/components/InputText';
import { useToast } from '@/context/toastContext';
import { apiCalls } from '@/utils/apiCalls';
import { Trip } from '@/types';
import CardTrip from '@/components/CardTrip';




const TripsSearchPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchword, setSearchword] = useState('');
  const [wordToHighlight, setWordToHighlight] = useState('');
  const { showToast } = useToast();

  console.log(trips);
  

  function isSearchwordOk() {
    if (!searchword || searchword.length < 2) { showToast('Please enter at least 2 letters'); return false }
    else return true
  }

  async function searchTrips() {
    setLoading(true);
    const res = await apiCalls.get(`/trips?searchword=${searchword}`);
    return res;
  }

  function handleSuccess(trips: Trip[]) {
    if (trips.length === 0) showToast('No matching trips found');
    setWordToHighlight(searchword);
    setTrips(trips);
    setLoading(false);
  }

  function handleFail() {
    showToast('Failed to search trips');
    setLoading(false);
  }
  
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchword(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!isSearchwordOk()) return;
    const res = await searchTrips(); 
    if (!res.items) return handleFail();
    handleSuccess(res.items);
  }

  async function deleteTrip(id: string) {
    showToast('Deleting trip...');
    const res = await apiCalls.del(`/trips/${id}`);
    if (res.error) showToast('Failed to delete trip');
    else {
      showToast('Trip deleted');
      setTrips(trips.filter(trip => trip.id !== id));
    }
  }


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='SEARCH TRIPS' className='md:translate-y-10 translate-y-7 translate-x-10 lg:-translate-x-10' />
          <GradientDescription 
            text={`Search trips by anything: category, keyword, author... Just write your search word and we'll find the right matches.`} 
            className='drop-shadow-lg text-center'
          />
          <aside className='mx-auto flex gap-4 mt-8 justify-center sm:flex-row flex-col'>
            <Link href='/trips' className='z-[5]'>
              <GradientButtonPurpleGray text='All Trips' className='sm:w-[200px] w-[100%]' />
            </Link>
            <Link href='/trips/favorites' className='z-[5]'>
              <GradientButtonPurpleOrange text='My Favorites' className='sm:w-[200px] w-[100%]' />
            </Link>
          </aside>
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='Search Trips' />
          <ContentSectionDescription text='Write what you are looking for' className='mb-20'/>
          <Container className='max-w-[500px] px-4'>
            <form className='mb-20' onSubmit={handleSubmit}>
              <InputText value={searchword} labelText='search word' inputName='searchword' onChange={handleChange} disabled={loading} className='mb-4' />
              <ContentSectionButton text='Search' type='submit' disabled={loading} />
            </form>
          </Container>

          {
            loading
            ?
            <p className='text-center'>searching...</p>
            :
            trips.map(trip => (<CardTrip key={trip.id} trip={trip} id={trip.id} onDelete={deleteTrip} className='mb-10' searchword={wordToHighlight} />))
          }
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default TripsSearchPage