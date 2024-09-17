'use client'

import React, { useState, useRef, useEffect } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import InputText from '@/components/InputText';
import InputTextarea from '@/components/InputTextarea';
import InputFileUpload from '@/components/InputFileUpload';
import ContentSectionButton from '@/components/ContentSectionButton';
import { apiCalls } from '@/utils/apiCalls';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { setFavoriteTrips } from '@/redux/slices/favoriteTripsSlice';
import { useToast } from '@/context/toastContext';
import CardTrip from '@/components/CardTrip';
import { Trip } from '@/types';
import Link from 'next/link';



const FavoriteTripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const favoriteTrips = useAppSelector((state) => state.favoriteTrips);
  const { showToast } = useToast();
  

  async function getFavoriteTrips() {
    const res = await apiCalls.post('/trips/batch', {tripIds: favoriteTrips});
    if (res.error) showToast('Failed to get your favorite trips');
    else setTrips(res);
    setLoading(false);
  }


  useEffect(() => { 
    if (favoriteTrips.length) getFavoriteTrips(); 
    else { setLoading(false); setTrips([])}
  }, [favoriteTrips]);


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='FAVORITE TRIPS' className='text-center mb-4' />
          <GradientDescription 
            text={`Add some info about yourself. See and manage your groups and trips`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <Container className='px-4'>
        <ContentSectionHeader text='Favorite Trips' />
        <ContentSectionDescription text='Trips you added to your favorites' className='mb-20'/>
          {trips.map(trip => (<CardTrip key={trip.id!} trip={trip} className='mb-10' />))}
          {loading && <p className='text-center'>Loading...</p>}
          {
            (!loading && !trips.length)
            &&
            <div>
              <p className='text-center'>No favorite trips found</p>
              <Link href='/profile'> <p className='text-textorange text-center'>Back to My Profile</p> </Link>
            </div>
          }
      </Container>

      <GradientFlexi />
    </>
  )
}

export default FavoriteTripsPage