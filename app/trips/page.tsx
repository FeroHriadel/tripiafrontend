'use client'

import React, { useState, useEffect, useRef } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import Container from '@/components/Container';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import CardTrip from '@/components/CardTrip';
import Link from 'next/link';
import { Trip } from '@/types';
import { apiCalls, uriEncodeObj } from '@/utils/apiCalls';
import { useToast } from '@/context/toastContext';
import GradientButtonPurpleGray from '@/components/GradientButtonPurpleGray';
import GradientButtonPurpleOrange from '@/components/GradientButtonPurpleOrange';



export const dynamic = 'force-dynamic';

const pageSize = 10;



const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<{[key: string]: any} | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);
 

  async function fetchTripsFromAPI() {
    const encodedLastEvaluatedKey = lastEvaluatedKey ? uriEncodeObj(lastEvaluatedKey) : null;
    const queryString = encodedLastEvaluatedKey ? `?lastEvaluatedKey=${encodedLastEvaluatedKey}&pageSize=${pageSize}` : `?pageSize=${pageSize}`;
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

  async function deleteTrip(id: string) {
    showToast('Deleting trip...');
    const res = await apiCalls.del(`/trips/${id}`);
    if (res.error) showToast('Failed to delete trip');
    else {
      showToast('Trip deleted');
      setTrips(trips.filter(trip => trip.id !== id));
    }
  }


  useEffect(() => { loadMoreTrips(); }, []);

  useEffect(() => { if (trips.length) observeLastCard(); }, [trips]); //will load more cards when last card shows in viewport


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='LATEST TRIPS' className='text-center mb-4' />
          <GradientDescription 
            text={`Choose from the list of trips. Click a trip card to see more details. Add trips to favorites and choose the best one later.     
            Search trips to find the best matches.`} 
            className='drop-shadow-lg text-center'
          />
          <aside className='mx-auto flex gap-4 mt-8 justify-center sm:flex-row flex-col'>
            <Link href='/trips/search' className='z-[5]'>
              <GradientButtonPurpleGray text='Search Trips' className='sm:w-[200px] w-[100%]' />
            </Link>
            <Link href='/trips/favorites' className='z-[5]'>
              <GradientButtonPurpleOrange text='My Favorites' className='sm:w-[200px] w-[100%]' />
            </Link>
          </aside>
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
            trips.map(trip => (<CardTrip key={trip.id} trip={trip} id={trip.id} onDelete={deleteTrip} className='mb-10' />))
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