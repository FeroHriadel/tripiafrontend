'use client'

import React, { useRef, useEffect } from 'react';
import CenteredImage from './CenteredImage';
import Tag from './Tag';
import ContentSectionButton from './ContentSectionButton';
import ContentSectionHeader from './ContentSectionHeader';
import ContentSectionDescription from './ContentSectionDescription';
import Container from './Container';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { setFavoriteTrips } from '@/redux/slices/favoriteTripsSlice';
import { useMap } from '@/hooks/useMap';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/context/toastContext';
import { formatUTCToHumanreadable } from '@/utils/dates';
import { Trip } from '@/types';
import TripComments from './TripComments';
import TripPdf from '@/components/TripPdf';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import Link from 'next/link';
import { apiCalls } from '@/utils/apiCalls';



interface Props {
  trip: Trip;
  isBeingViewed: boolean
}



export const dynamic = 'force-dynamic';

const initialCoords: [number, number] = [17.124620012584664, 48.12800397232297]; //long, lat  (Sustekova - Bratislava, SK)

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;



const TripModalContent = ({ trip, isBeingViewed }: Props) => {
  //VALUES - GENERAL
  const categories = useAppSelector(state => state.categories);
  const favoriteTrips = useAppSelector((state) => state.favoriteTrips);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { user } = useAuth();

  //VALUES - MAP
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


  //FUNCTIONS - PDF DOWNLOAD
  async function handleDownload() {
    if (!trip) return;
    showToast('Preparing PDF download...');
    const mapImages = await getMapImages();
    const blob = await pdf(
      <TripPdf 
        trip={trip} 
        categoryName={getCategoryName(trip?.category)}
        mapImages={mapImages}
      />
    ).toBlob();
    saveAs(blob, `tripia-${trip.name}.pdf`);
  };

  async function getMapImages() {
    let mapImages = { meeting: '', destination: '' };
    if (destinationMapExists()) {
      const destinationImage = await fetchMapImage(trip!.destinationLat!, trip!.destinationLng!);
      mapImages.destination = destinationImage;
    }
    if (meetingMapExists()) {
      const meetingImage = await fetchMapImage(trip!.meetingLat!, trip!.meetingLng!);
      mapImages.meeting = meetingImage;
    }
    return mapImages;
  }

  async function fetchMapImage(lat: number, lng: number): Promise<string> { //makes api call to mapbox which returns an image based on queryStringParams
    const width = 790;
    const height = 400;
    const zoom = 12;
    const marker = `pin-l+ff0000(${lng},${lat})`;
    const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${marker}/${lng},${lat},${zoom}/${width}x${height}?access_token=${mapboxToken}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch the map image');
        const arrayBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        console.error('Error fetching map image:', error);
        throw new Error('Unable to fetch map image');
    }
  }

  //FUNCTIONS - TRIP DETAILS
  function tagsFromKeywords() { return trip?.keyWords?.split(',') || []; }

  function getCategoryName(categoryId: string | null | undefined) {
    if (!categoryId) return '';
    const category = categories.find(category => category.id === categoryId);
    return category ? category.name : '';
  }

  function canShowAddToFavorites() {
    if (user.email && user.email !== trip!.createdBy && !favoriteTrips.includes(trip!.id!)) return true
    else return false;
  }

  async function addToFavorites(tripId: string) {
    if (favoriteTrips.includes(tripId)) return showToast('Already in favorites');
    showToast('Adding to favorites...');
    let newFavoriteTrips = [...favoriteTrips, tripId];
    dispatch(setFavoriteTrips(newFavoriteTrips));
    await apiCalls.post('/favoritetrips', {tripIds: newFavoriteTrips});
  }

  //FUNCTIONS - RENDER MAP IN BROWSER
  function destinationMapExists() {
    if (trip?.destinationLng && trip?.destinationLat) return true;
    else return false;
  }

  function meetingMapExists() {
    if (trip?.meetingLng && trip?.meetingLat) return true;
    else return false;
  }


  //SUBSCRIPTINS
  useEffect(() => { // render destination map if any
    if (!isBeingViewed) { destinationMapContainerRef.current = null; return; };
    if (trip?.destinationLng && trip?.destinationLat && destinationMapContainerRef.current) { 
      renderDestinationMap(); placeDestinationMarker({ lng: trip.destinationLng, lat: trip.destinationLat }); }
  }, [trip, destinationMapContainerRef.current, isBeingViewed]);

  useEffect(() => { // render meeting point map if any
    if (!isBeingViewed) { meetingMapContainerRef.current = null; return; };
    if (trip?.meetingLng && trip?.meetingLat && meetingMapContainerRef.current) {
      renderMeetingMap(); placeMeetingMarker({ lng: trip.meetingLng, lat: trip.meetingLat }); }
  }, [trip, meetingMapContainerRef.current, isBeingViewed]);


  //RENDER
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

          {/* destination + destination map */}
          <h4 className='font-semibold text-xl xs:text-xl md:text-xl mb-4'>
            Destination: 
            {' '}
            <span className='font-normal'>{trip.destination}</span>
          </h4>
          {
            isBeingViewed && destinationMapExists()
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

          {/* meeting point & meeting map */}
          <h4 className='font-semibold text-xl xs:text-xl md:text-xl mb-4'>
            Meeting Point: 
            {' '}
            <span className='font-normal'>{trip.departureFrom}</span>
          </h4>
          {
            isBeingViewed && meetingMapExists()
            &&
            <div className='w-[100%] h-[400px] mb-10 rounded-2xl' ref={meetingMapContainerRef} />
          }
        </Container>
      {/* printable content end */}
      </Container>

      {/* buttons */}
      <ContentSectionButton text='Download as PDF' className='mb-4' onClick={handleDownload} />
            {
              (user.email && user?.email === trip.createdBy)
              &&
              <Link href={`/trips/edit/${trip.id}`}>
                <ContentSectionButton text='Edit' className='mb-4' />
              </Link>
            }
            {
              canShowAddToFavorites() && <ContentSectionButton text='Add to Favorites' className='mb-4' onClick={() => addToFavorites(trip.id!)} />
            }

      {/* chat section */}
      {(isBeingViewed && trip?.id && user.email) && <TripComments trip={trip} />}
    </section>
  )
}

export default TripModalContent