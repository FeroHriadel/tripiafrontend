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
import { Trip } from '@/types';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/context/toastContext';



export const dynamic = 'force-dynamic';



const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<{[key: string]: any} | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);
 

  function uriEncodeObj(obj: {[key: string]: any}) {
    const stringified = JSON.stringify(obj);
    const uriEncoded = encodeURIComponent(stringified);
    return uriEncoded;
  }

  async function fetchTripsFromAPI() {
    const encodedLastEvaluatedKey = lastEvaluatedKey ? uriEncodeObj(lastEvaluatedKey) : null;
    const queryString = encodedLastEvaluatedKey ? `?lastEvaluatedKey=${encodedLastEvaluatedKey}` : '';
    const res = await apiCalls.get('/trips' + queryString);
    return res;
  }

  async function loadMoreTrips() {
    setLoading(true);
    const res = await fetchTripsFromAPI();
    if (!res.items) { showToast(res.error || 'Failed to get more trips'); return setLoading(false) }
    setLastEvaluatedKey(res.lastEvaluatedKey);
    setTrips([...trips, ...res.items]);
    setLoading(false);
  }

  function isMoreCardsToLoad() {
    if (lastEvaluatedKey) return true
    else return false;
  }
  
  function unobserveLastCard() { if (observerRef.current) observerRef.current.disconnect(); }

  function observeLastCard() {
    unobserveLastCard();
    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && isMoreCardsToLoad()) loadMoreTrips();
    });
    if (trips.length > 0) {
      const lastTripIdx = trips.length - 1;
      const lastCardEl = document.getElementById(`${trips[lastTripIdx].id}`);
      if (lastCardEl) observerRef.current.observe(lastCardEl);
    }
  }


  useEffect(() => { loadMoreTrips(); }, []);

  useEffect(() => { if (trips.length) observeLastCard(); }, [trips]); //will load more cards when last card shows in viewport


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
            trips.map(trip => (<TripCard key={trip.id} trip={trip} id={trip.id} className='mb-10' />))
          }
          { /* if no trips */ !loading && trips.length === 0 && <p className='text-center'>No trips found</p> }
          { /* loader */ loading && <p className='text-center'>Loading...</p> }
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default TripsPage