'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/context/toastContext';
import { useAppSelector } from '@/redux/store';
import { useMap } from '@/hooks/useMap';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import GradientDescription from '@/components/GradientDescription';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import CenteredImage from '@/components/CenteredImage';
import Tag from '@/components/Tag';
import { Trip } from '@/types';
import { apiCalls } from '@/utils/apiCalls';
import { formatUTCToHumanreadable } from '@/utils/dates';



const initialCoords: [number, number] = [17.124620012584664, 48.12800397232297]; //long, lat  (Sustekova - Bratislava, SK)



const TripDetailsPage = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { id } = useParams();
  const router = useRouter();
  const categories = useAppSelector(state => state.categories);
  const meetingMapContainerRef = useRef<HTMLDivElement | null>(null);
  const meetingMapRef = useRef<mapboxgl.Map | null>(null);
  const meetingMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMapContainerRef = useRef<HTMLDivElement | null>(null);
  const destinationMapRef = useRef<mapboxgl.Map | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { renderMap: renderDestinationMap, placeMarker: placeDestinationMarker } = useMap({
    initialCoords: initialCoords,
    onMapClick: () => {},
    mapRef: destinationMapRef,
    markerRef: destinationMarkerRef,
    mapContainerRef: destinationMapContainerRef,
    interactive: false
  });
  const { renderMap: renderMeetingMap, placeMarker: placeMeetingMarker } = useMap({
    initialCoords: initialCoords,
    onMapClick: () => {},
    mapRef: meetingMapRef,
    markerRef: meetingMarkerRef,
    mapContainerRef: meetingMapContainerRef,
    interactive: false
  });



  function tagsFromKeywords() { return trip?.keyWords?.split(',') || []; }

  function getCategoryName(categoryId: string) {
    const category = categories.find(category => category.id === categoryId);
    return category ? category.name : '';
  }

  async function getTripById() {
    const res = await apiCalls.get(`/trips?id=${id}`);
    if (res.error) { showToast('Failed to fetch trip. Redirecting...'); return router.push('/trips'); }
    setTrip(res); setLoading(false);
  }


  useEffect(() => { getTripById(); }, []); //fetch trip on page load

  useEffect(() => {
    if (trip?.destinationLng && trip?.destinationLat && destinationMapContainerRef.current) { 
      renderDestinationMap(); placeDestinationMarker({ lng: trip.destinationLng, lat: trip.destinationLat }); }
  }, [trip, destinationMapContainerRef.current]);

  useEffect(() => {
    if (trip?.meetingLng && trip?.meetingLat && meetingMapContainerRef.current) {
      renderMeetingMap(); placeMeetingMarker({ lng: trip.meetingLng, lat: trip.meetingLat }); }
  }, [trip, meetingMapContainerRef.current]);


  if (loading) return <p className='mt-20 text-center'>Loading...</p>

  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='TRIP DETAILS' className='text-center mb-4' />
          <GradientDescription text={`See the trip details. Print it out and talk with the organizer in the chat section at the bottom`} className='drop-shadow-lg text-center' />
        </Container>
      </GradientFlexi>

      {
        trip?.id
        &&
        <ContentSection>
          <Container className='px-4'>
            <ContentSectionHeader text='Trip Details' />
            <ContentSectionDescription text='Check the trip out in detail' className='mb-20'/>

            {trip.image && <CenteredImage src={trip.image} width={'100%'} height={500} className='rounded-2xl mb-10' />}

            {/* printable content */}
            <Container className='px-x mb-4 printable'>
              {/* name */}
              <ContentSectionHeader text={trip.name.toUpperCase()} style={{lineHeight: '2rem', fontSize: '2rem'}} className='mb-4' />

              {
                /* keyWords (tags) */
                trip.keyWords
                &&
                <div className="w-[100%] flex justify-center gap-2 mb-4">
                  {
                    tagsFromKeywords().map((keyWord, idx) => (
                      <Tag text={keyWord} key={keyWord + idx} />
                    ))
                  }
                </div>
              }

              {/* category */}
              {trip.category && <ContentSectionDescription text={getCategoryName(trip?.category)} className='text-xl xs:text-xl md:text-xl mb-10'/>}

              {/* destination */}
              <h4 className='font-semibold text-xl xs:text-xl md:text-xl mb-4'>
                Destination: 
                {' '}
                <span className='font-normal'>{trip.destination}</span>
              </h4>
              {/*
                trip.destinationLng && trip.destinationLat
                &&
                <div className='w-[100%] h-[400px] mb-4 rounded-2xl' ref={destinationMapContainerRef} />
              */}

              {/* description */}
              <h4 className='font-semibold text-xl xs:text-xl md:text-xl mb-4'>
                Description: 
                {' '}
                <span className='font-normal'>{trip.description}</span>
              </h4>

              {
                /* requirements */
                trip.requirements
                &&
                <h4 className='font-semibold text-xl xs:text-xl md:text-xl mb-4'>
                  Requirements: 
                  {' '}
                  <span className='font-normal'>{trip.requirements}</span>
                </h4>
              }

              {/* date */}
              <h4 className='font-semibold text-xl xs:text-xl md:text-xl mb-4'>
                Date: 
                {' '}
                <span className='font-normal'>
                  {formatUTCToHumanreadable(trip.departureDate) + ' at ' + ` ${trip.departureTime}`}
                </span>
              </h4>

              {/* meeting point */}
              <h4 className='font-semibold text-xl xs:text-xl md:text-xl mb-4'>
                Meeting Point: 
                {' '}
                <span className='font-normal'>{trip.departureFrom}</span>
              </h4>
              {/*
                trip.meetingLng && trip.meetingLat
                &&
                <div className='w-[100%] h-[400px] mb-10 rounded-2xl' ref={meetingMapContainerRef} />
              */}
            </Container>
          </Container>
        </ContentSection>
      }
    </>
  )
}

export default TripDetailsPage