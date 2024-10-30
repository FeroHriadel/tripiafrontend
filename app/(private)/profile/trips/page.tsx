'use client'

import React, { useState, useEffect, useRef } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import Container from '@/components/Container';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import TripCard from '@/components/TripCard';
import Link from 'next/link';
import { Trip } from '@/types';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/context/toastContext';
import { useAuth } from '@/context/authContext';
import GradientButtonPurpleGray from '@/components/GradientButtonPurpleGray';
import GradientButtonPurpleOrange from '@/components/GradientButtonPurpleOrange';



export const dynamic = 'force-dynamic';




const MyTripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();
  const { email } = user;

 
  function handleError(error: string) {
    showToast(error);
    setLoading(false);
  }

  function handleSuccess(trips: Trip[]) {
    setTrips([...trips]);
    setLoading(false);
  }

  async function fetchTripsFromAPI() {
    const encodedEmail = encodeURIComponent(email);
    const queryString = `?createdBy=${encodedEmail}`;
    const res = await apiCalls.get('/trips' + queryString);
    return res;
  }

  async function loadTrips() {
    if (!email) return;
    const res = await fetchTripsFromAPI();
    if (res.error) handleError(res.error);
    else handleSuccess(res);
  }


  async function deleteTrip(id: string) {
    setLoading(true);
    showToast('Deleting trip...');
    const res = await apiCalls.del(`/trips/${id}`);
    if (res.error) handleError('Failed to delete trip');
    else handleSuccess(trips.filter(trip => trip.id !== id));
  }


  useEffect(() => { loadTrips(); }, [email]);


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='MY TRIPS' className='text-center mb-4' />
          <aside className='mx-auto flex gap-4 mt-8 justify-center sm:flex-row flex-col'>
            <Link href='/profile' className='z-[5]'>
              <GradientButtonPurpleGray text='My Profile' className='sm:w-[200px] w-[100%]' />
            </Link>
            <Link href='/trips/profile/favorites' className='z-[5]'>
              <GradientButtonPurpleOrange text='My Favorites' className='sm:w-[200px] w-[100%]' />
            </Link>
          </aside>
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4 max-w-[750px]'>
          <ContentSectionHeader text='My Trips' />
          <ContentSectionDescription text='Trips organized by me' className='mb-20'/>
          {
            /* render trips */
            trips && trips.length > 0
            &&
            trips.map(trip => (<TripCard key={trip.id} trip={trip} id={trip.id} onDelete={deleteTrip} className='mb-10' />))
          }
          { /* if no trips */ !loading && trips.length === 0 && <p className='text-center'>No trips found</p> }
          { /* loader */ loading && <p className='text-center'>Loading...</p> }
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default MyTripsPage