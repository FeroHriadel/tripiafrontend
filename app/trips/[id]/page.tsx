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
import { Trip } from '@/types';
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

  

  // const handleDownload = () => {
  //   console.log('handleDownload function triggered');
  //   const input = document.getElementById('printable');
  //   if (input) {
  //     console.log('Printable element found');
      
  //     const waitForMapLoad = (mapRef) => {
  //       return new Promise((resolve) => {
  //         if (mapRef.current) {
  //           const map = mapRef.current;
  //           if (map.loaded()) {
  //             resolve();
  //           } else {
  //             map.on('load', () => {
  //               resolve();
  //             });
  //           }
  //         } else {
  //           console.error('Map reference is null');
  //           resolve(); // Resolve immediately if the map ref is null
  //         }
  //       });
  //     };
  
  //     const destinationMapCanvasPromise = waitForMapLoad(destinationMapRef).then(() => {
  //       return new Promise<void>((resolve) => {
  //         if (destinationMapContainerRef.current) {
  //           html2canvas(destinationMapContainerRef.current).then(canvas => {
  //             const imgData = canvas.toDataURL('image/png');
  //             const imgElement = document.createElement('img');
  //             imgElement.src = imgData;
  //             destinationMapContainerRef.current.innerHTML = ''; // Clear existing content
  //             destinationMapContainerRef.current.appendChild(imgElement);
  //             resolve();
  //           });
  //         }
  //       });
  //     });
  
  //     const meetingMapCanvasPromise = waitForMapLoad(meetingMapRef).then(() => {
  //       return new Promise<void>((resolve) => {
  //         if (meetingMapContainerRef.current) {
  //           html2canvas(meetingMapContainerRef.current).then(canvas => {
  //             const imgData = canvas.toDataURL('image/png');
  //             const imgElement = document.createElement('img');
  //             imgElement.src = imgData;
  //             meetingMapContainerRef.current.innerHTML = ''; // Clear existing content
  //             meetingMapContainerRef.current.appendChild(imgElement);
  //             resolve();
  //           });
  //         }
  //       });
  //     });
  
  //     Promise.all([destinationMapCanvasPromise, meetingMapCanvasPromise])
  //       .then(() => {
  //         console.log('All map canvases created');
  
  //         // Now create the final PDF using html2canvas and jsPDF
  //         html2canvas(input).then((canvas) => {
  //           const imgData = canvas.toDataURL('image/png');
  //           const pdf = new jsPDF({
  //             orientation: 'portrait',
  //             unit: 'px',
  //             format: [canvas.width, canvas.height]
  //           });
  //           pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  //           pdf.save('trip-details.pdf');
  //         });
  
  //       }).catch(error => {
  //         console.error('Error capturing map images:', error);
  //       });
  //   } else {
  //     console.error('Printable element not found');
  //   }
  // };
  
  const handleDownload = () => {
    console.log('handleDownload function triggered');
    const input = document.getElementById('printable');
    if (input) {
      console.log('Printable element found');
  
      const waitForMapLoad = (mapRef) => {
        return new Promise((resolve) => {
          if (mapRef.current) {
            const map = mapRef.current;
            if (map.loaded()) {
              resolve();
            } else {
              map.on('load', () => {
                resolve();
              });
            }
          } else {
            console.error('Map reference is null');
            resolve(); // Resolve if the map ref is null
          }
        });
      };
  
      const destinationMapCanvasPromise = waitForMapLoad(destinationMapRef).then(() => {
        return new Promise<void>((resolve) => {
          if (destinationMapContainerRef.current) {
            const destinationMap = destinationMapRef.current;
            if (destinationMap) {
              html2canvas(destinationMapContainerRef.current).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const imgElement = document.createElement('img');
                imgElement.src = imgData;
                destinationMapContainerRef.current.innerHTML = ''; destinationMapRef.current = null; // Clear existing content
                destinationMapContainerRef.current.appendChild(imgElement);
                resolve();
              });
            } else {
              console.error('Destination map not found');
            }
          }
        });
      });
  
      const meetingMapCanvasPromise = waitForMapLoad(meetingMapRef).then(() => {
        return new Promise<void>((resolve) => {
          if (meetingMapContainerRef.current) {
            const meetingMap = meetingMapRef.current;
            if (meetingMap) {
              setTimeout(() => {
                html2canvas(meetingMapContainerRef.current).then((canvas) => {
                  const imgData = canvas.toDataURL('image/png');
                  const imgElement = document.createElement('img');
                  imgElement.src = imgData;
                  meetingMapContainerRef.current.innerHTML = ''; meetingMapRef.current = null // Clear existing content
                  meetingMapContainerRef.current.appendChild(imgElement);
                  resolve();
                });
              }, 2000);
            } else {
              console.error('Meeting map not found');
            }
          }
        });
      });
  
      Promise.all([destinationMapCanvasPromise, meetingMapCanvasPromise])
        .then(() => {
          console.log('All map canvases created');
          // Proceed with generating the PDF
          const doc = new jsPDF('p', 'mm', 'a4');
          html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 10, 10, 190, 280);
            doc.save('trip-details.pdf');
            
            // Restore the maps after the PDF is downloaded
            renderDestinationMap();
            renderMeetingMap();
            placeDestinationMarker({ lng: trip.destinationLng, lat: trip.destinationLat });
            placeMeetingMarker({ lng: trip.meetingLng, lat: trip.meetingLat });
          });
        })
        .catch((error) => {
          console.error('Error capturing map images:', error);
        });
    } else {
      console.error('Printable element not found');
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  useEffect(() => { getTripById(); }, []); //fetch trip on page load

  useEffect(() => { //render destination map if any
    if (trip?.destinationLng && trip?.destinationLat && destinationMapContainerRef.current) { 
      renderDestinationMap(); placeDestinationMarker({ lng: trip.destinationLng, lat: trip.destinationLat }); }
  }, [trip, destinationMapContainerRef.current]);

  useEffect(() => { //render meeting point map if any
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
              {
                trip.destinationLng && trip.destinationLat
                &&
                <div className='w-[100%] h-[400px] mb-4 rounded-2xl' ref={destinationMapContainerRef} />
              }

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
              {
                trip.meetingLng && trip.meetingLat
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

export default TripDetailsPage