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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const initialCoords: [number, number] = [17.124620012584664, 48.12800397232297]; //long, lat  (Sustekova - Bratislava, SK)

const TripDetailsPage = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { id } = useParams();
  const router = useRouter();
  const categories: Category[] = useAppSelector(state => state.categories);
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

  async function waitForMapLoad(mapRef: React.MutableRefObject<mapboxgl.Map | null>): Promise<void> {
    return new Promise<void>((resolve) => {
      if (mapRef.current) {
        const map = mapRef.current;
        if (map.loaded()) {
          resolve();
        } else {
          map.on('load', () => resolve());
        }
      } else {
        console.error('Map reference is null');
        resolve();
      }
    });
  }

  async function destinationMapToImg(): Promise<void> { //converts destinationMap to <img />
    await waitForMapLoad(destinationMapRef);
    if (destinationMapContainerRef.current) {
      const destinationMap = destinationMapRef.current;
      if (destinationMap) {
        const canvas = await html2canvas(destinationMapContainerRef.current);
        const imgData = canvas.toDataURL('image/png');
        const imgElement = document.createElement('img');
        imgElement.src = imgData;
        destinationMapContainerRef.current.innerHTML = ''; // clear the map
        destinationMapContainerRef.current.appendChild(imgElement); // insert the image instead
        destinationMapRef.current = null;
      } else {
        console.error('Destination map not found');
      }
    }
  }

  async function meetingMapToImg(): Promise<void> { //converts meetingMap to <img />
    await waitForMapLoad(meetingMapRef);
    if (meetingMapContainerRef.current) {
      const meetingMap = meetingMapRef.current;
      if (meetingMap) {
        const canvas = await html2canvas(meetingMapContainerRef.current);
        const imgData = canvas.toDataURL('image/png');
        const imgElement = document.createElement('img');
        imgElement.src = imgData;
        meetingMapContainerRef.current.innerHTML = ''; // clear the map
        meetingMapContainerRef.current.appendChild(imgElement); // insert the image
        meetingMapRef.current = null;
      } else {
        console.error('Meeting map not found');
      }
    }
  }

  function destinationMapExists() {
    if (trip?.destinationLng && trip?.destinationLat) return true;
    else return false;
  }

  function meetingMapExists() {
    if (trip?.meetingLng && trip?.meetingLat) return true;
    else return false;
  }

  const handleDownload = async () => {
    const input = document.getElementById('printable');
    if (input) {
      showToast('Downloading...');
      try {
        // convert maps to images only if the maps exist
        if (destinationMapExists()) await destinationMapToImg();
        if (meetingMapExists()) await meetingMapToImg();
  
        // generate the PDF
        const doc = new jsPDF('p', 'mm', 'a4'); // A4 page size (210x297 mm)
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        
        const imgWidth = 190; // width of the image in mm
        const pageHeight = 280; // height of the page in mm (leaving margins)
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // scale the height proportionally

        let heightLeft = imgHeight;
        let position = 10; // starting position on first page

        doc.addImage(imgData, 'PNG', 10, position, imgWidth, Math.min(imgHeight, pageHeight)); // add the first image to the first page
        heightLeft -= pageHeight;

        while (heightLeft > 0) { // add additional pages as needed
          position = 0; // reset position for new pages
          doc.addPage();
          doc.addImage(imgData, 'PNG', 10, position, imgWidth, Math.min(heightLeft, pageHeight));
          heightLeft -= pageHeight;
        }
        doc.save(`${trip!.name}-trip-details.pdf`);
  
        // restore the maps after PDF generation
        if (destinationMapExists()) {
          destinationMapContainerRef.current!.innerHTML = '';
          renderDestinationMap();
          placeDestinationMarker({ lng: trip!.destinationLng!, lat: trip!.destinationLat! });
        }
        if (meetingMapExists()) {
          meetingMapContainerRef.current!.innerHTML = '';
          renderMeetingMap();
          placeMeetingMarker({ lng: trip!.meetingLng!, lat: trip!.meetingLat! });
        }
  
      } catch (error) {
        console.error('Error capturing map images or generating PDF:', error);
        showToast('Failed to download');
      }
    } else {
      console.error('Printable element not found');
      showToast('Failed to download');
    }
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
