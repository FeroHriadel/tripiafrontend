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
import ContentSectionButton from '@/components/ContentSectionButton';
import GradientDescription from '@/components/GradientDescription';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import CenteredImage from '@/components/CenteredImage';
import Tag from '@/components/Tag';
import { Trip, Category } from '@/types';
import { apiCalls } from '@/utils/apiCalls';
import { formatUTCToHumanreadable } from '@/utils/dates';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import TripPdf from '@/components/TripPdf';




const initialCoords: [number, number] = [17.124620012584664, 48.12800397232297]; //long, lat  (Sustekova - Bratislava, SK)

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;



const TripDetailsPage = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [mapImages, setMapImages] = useState({ meeting: '', destination: '' });
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

  function getCategoryName(categoryId: string | null | undefined) {
    if (!categoryId) return '';
    const category = categories.find(category => category.id === categoryId);
    return category ? category.name : '';
  }

  async function getTripById() {
    const res = await apiCalls.get(`/trips?id=${id}`);
    if (res.error) { showToast('Failed to fetch trip. Redirecting...'); return router.push('/trips'); }
    setTrip(res); setLoading(false);
  }

  function destinationMapExists() {
    if (trip?.destinationLng && trip?.destinationLat) return true;
    else return false;
  }

  function meetingMapExists() {
    if (trip?.meetingLng && trip?.meetingLat) return true;
    else return false;
  }

  async function fetchMapImage(lat: number, lng: number): Promise<string> {
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


  useEffect(() => { getTripById(); }, []); // fetch trip on page load

  useEffect(() => { // render destination map if any
    if (trip?.destinationLng && trip?.destinationLat && destinationMapContainerRef.current) { 
      renderDestinationMap(); placeDestinationMarker({ lng: trip.destinationLng, lat: trip.destinationLat }); }
  }, [trip, destinationMapContainerRef.current]);

  useEffect(() => { // render meeting point map if any
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

            <ContentSectionButton text='Download as PDF' className='printable' onClick={handleDownload} />
          </Container>
        </ContentSection>
      }

      {
        trip?.id
        &&
        <ContentSection>
          <Container className='px-4'>
            <ContentSectionHeader text='Chat' />
            <ContentSectionDescription text='Talk with the organizer' className='mb-20' />
            {/* chat section */}
          </Container>
        </ContentSection>
      }
    </>
  )
}

export default TripDetailsPage;
