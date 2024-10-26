'use client'

import React, { useRef, useEffect } from 'react';
import CenteredImage from './CenteredImage';
import Tag from './Tag';
import ContentSectionButton from './ContentSectionButton';
import ContentSectionHeader from './ContentSectionHeader';
import ContentSectionDescription from './ContentSectionDescription';
import Container from './Container';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { useMap } from '@/hooks/useMap';
import { formatUTCToHumanreadable } from '@/utils/dates';
import { Trip } from '@/types';



interface Props {
  trip: Trip;
  isBeingViewed: boolean
}



export const dynamic = 'force-dynamic';

const initialCoords: [number, number] = [17.124620012584664, 48.12800397232297]; //long, lat  (Sustekova - Bratislava, SK)

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;



const TripModalContent = ({ trip, isBeingViewed }: Props) => {
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

  function getCategoryName(categoryId: string | null | undefined) {
    if (!categoryId) return '';
    const category = categories.find(category => category.id === categoryId);
    return category ? category.name : '';
  }

  function destinationMapExists() {
    if (trip?.destinationLng && trip?.destinationLat) return true;
    else return false;
  }

  function meetingMapExists() {
    if (trip?.meetingLng && trip?.meetingLat) return true;
    else return false;
  }


  useEffect(() => { // render destination map if any
    if (!isBeingViewed) return;
    if (trip?.destinationLng && trip?.destinationLat && destinationMapContainerRef.current) { 
      renderDestinationMap(); placeDestinationMarker({ lng: trip.destinationLng, lat: trip.destinationLat }); }
  }, [trip, destinationMapContainerRef.current]);

  useEffect(() => { // render meeting point map if any
    if (!isBeingViewed) return;
    if (trip?.meetingLng && trip?.meetingLat && meetingMapContainerRef.current) {
      renderMeetingMap(); placeMeetingMarker({ lng: trip.meetingLng, lat: trip.meetingLat }); }
  }, [trip, meetingMapContainerRef.current]);


  return (
    <section className='w-[100%]'>
      <Container className='px-4 text-left'>

        {/* image */}
        {trip.image && <CenteredImage src={trip.image} width={'100%'} height={500} className='rounded-2xl mb-10' />}

        {/* printable content start */}
        <Container className='px-x mb-20' id='printable'>
          {/* name */}
          <ContentSectionHeader text={trip.name.toUpperCase()} style={{lineHeight: '2rem', fontSize: '2rem'}} className='mb-4' />

          {/* keyWords (tags) */}
          {
            trip.keyWords
            &&
            <div className="w-[100%] flex justify-center gap-2 mb-4">
              {tagsFromKeywords().map((keyWord, idx) => (<Tag text={keyWord} key={keyWord + idx} />))}
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
          {
            destinationMapExists()
            &&
            <div className='w-[100%] h-[400px] mb-4 rounded-2xl' ref={destinationMapContainerRef} />
          }

          {/* description */}
          <h4 className='font-semibold text-xl xs:text-xl md:text-xl mb-4'>
            Description: 
            {' '}
            <span className='font-normal'>{trip.description}</span>
          </h4>

          {/* requirements */}
          {
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
          {
            meetingMapExists()
            &&
            <div className='w-[100%] h-[400px] mb-10 rounded-2xl' ref={meetingMapContainerRef} />
          }
        </Container>
      {/* printable content end */}
      </Container>

      {/* chat section */}
      {/* {trip?.id && user.email && <TripComments trip={trip} />} */}
    </section>
  )
}

export default TripModalContent