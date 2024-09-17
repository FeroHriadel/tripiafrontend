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
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  

  async function getFavoriteTrips() {
    const res = await apiCalls.post('/trips/batch', {tripIds: favoriteTrips});
    if (res.error) handleFail();
    else await handleSuccess(res);
  }

  async function handleSuccess(gettripsResponse: Trip[]) {
    setTrips(gettripsResponse); 
    await removeExpiredTripsFromFavorites(gettripsResponse);
    setLoading(false);
  }

  async function handleFail() {
    showToast('Failed to get your favorite trips');
  }

  async function removeExpiredTripsFromFavorites(getTripsResponse: Trip[]) {
    //user's favorite trips don't ever get updated. 
    //if a trip expires it is deleted. But nothing deletes that trip from user's favoriteTrips.
    //batchGetTrips (getFavoriteTrips() fn above) only returns unexpired trips.
    //this function removes expired trips from user's favoriteTrips array.
    //this is the cheapest way to update user's favoriteTrips (in terms of db cost) - that's why backend doesn't handle it.
    const unexpiredTripsIds = getTripsResponse.map(trip => trip.id!);
    if (unexpiredTripsIds.length !== favoriteTrips.length) {
      dispatch(setFavoriteTrips(unexpiredTripsIds));
      await apiCalls.post('/favoritetrips', {tripIds: unexpiredTripsIds});
    }
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