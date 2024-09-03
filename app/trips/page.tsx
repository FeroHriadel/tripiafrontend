'use client'

import React, { useState, useEffect } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import Container from '@/components/Container';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import TripCard from '@/components/TripCard'; 
import { Trip } from '@/types';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/context/toastContext';



export const dynamic = 'force-dynamic';



const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<{[key: string]: any} | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  

  function uriEncodeObj(obj: {[key: string]: any}) {
    const stringified = JSON.stringify(obj);
    const uriEncoded = encodeURIComponent(stringified);
    return uriEncoded;
  }

  async function fetchTrips() {
    const encodedLastEvaluatedKey = lastEvaluatedKey ? uriEncodeObj(lastEvaluatedKey) : null;
    const queryString = encodedLastEvaluatedKey ? `?lastEvaluatedKey=${encodedLastEvaluatedKey}` : '';
    const res = await apiCalls.get('/trips' + queryString);
    return res;
  }

  async function getTrips() {
    setLoading(true);
    const res = await fetchTrips();
    if (!res.items) { showToast(res.error || 'Failed to get more trips'); return setLoading(false) }
    if (res.lastEvaluatedKey) setLastEvaluatedKey(res.lastEvaluatedKey);
    setTrips([...trips, ...res.items]);
    setLoading(false);
  }


  useEffect(() => {
    getTrips();
  }, [])


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='LATEST TRIPS' className='md:translate-y-10 translate-y-7 translate-x-10 lg:-translate-x-10' />
          <GradientDescription 
            text={`Choose from the list of trips. Click a trip card to see more details. Add trips to favorites and choose the best one later.     
            Filter trips to get the most relevant results.`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='Latest Trips' />
          <ContentSectionDescription text='Browse trips and join one you like' className='mb-20'/>
          {
            /* render trips */
            trips && trips.length > 0
            &&
            trips.map(trip => (
              <TripCard key={trip.id} trip={trip} id={trip.id} className='mb-8' />
            ))
          }
          {
            /* if no trips */
            !loading && trips.length === 0
            &&
            <p className='text-center'>No trips found</p>
          }
          {
            /* loader */
            loading
            &&
            <p className='text-center'>Loading...</p>
          }
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default TripsPage