'use client'

import React, { useEffect, useState, useRef } from 'react';
import InputText from '@/components/InputText'
import InputSelect from '@/components/InputSelect'
import InputTextarea from '@/components/InputTextarea'
import ContentSectionDescription from '@/components/ContentSectionDescription'
import ContentSectionHeader from '@/components/ContentSectionHeader'
import ContentSectionButton from './ContentSectionButton';
import { LuImagePlus } from "react-icons/lu";
import { Trip } from '@/types';
import { useAppSelector } from '@/redux/store';
import { resizeImage } from '@/utils/imageUpload';
import { useToast } from '@/context/toastContext';
import  { useMap } from '@/hooks/useMap';



interface Props {
  handleChange: (event: any) => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string;
  trip: Trip;
  loading: boolean;
}



const initialCoords: [number, number] = [17.124620012584664, 48.12800397232297]; //long, lat  (Sustekova - Bratislava, SK)



const TripDetails = ({ trip, loading, imagePreview, handleChange, handleImageChange }: Props) => {
  //non-map related values:
  const categories = useAppSelector((state) => state.categories);
  const { showToast } = useToast();
  

  //meeting point map values & functions:
  const [meetingMapShown, setMeetingMapShown] = useState(false);
  const [meetingAddress, setMeetingAddress] = useState('');
  const meetingMapContainerRef = useRef<HTMLDivElement | null>(null);
  const meetingMapRef = useRef<mapboxgl.Map | null>(null);
  const meetingMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { renderMap: renderMeetingMap, removeMap: removeMeetingMap, getCoordsFromAddress, placeMarker: placeMeetingMarker } = useMap({
    initialCoords: initialCoords,
    onMapClick: onMeetingMapClick,
    meetingMapRef,
    meetingMarkerRef,
    meetingMapContainerRef,
  });

  async function onMeetingMapClick(event: any) {
    const { lng, lat } = event;
    handleChange({ name: 'meetingCoords', value: { meetingLat: lat, meetingLng: lng } });
    clearMeetingAddressInput()
  }

  function toggleMeetingMap() {
    if (!meetingMapShown) {
      setMeetingMapShown(true);
    } else {
      removeMeetingMap();
      setMeetingMapShown(false);
      clearMeetingAddressInput()
    }
  }
  
  function handleMeetingAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMeetingAddress(e.target.value);
  }

  function clearMeetingAddressInput() {
    setMeetingAddress('');
  }

  async function meetingAddressToCoords(address: string) {
    try {
      if (!address || address.length < 6) return showToast('Please enter a valid address');
      const res = await getCoordsFromAddress(address); if (!res.coords?.lat) throw new Error('Coords not found');
      const { lat, lng } = res.coords!;
      handleChange({ name: 'meetingCoords', value: {lat, lng} });
      placeMeetingMarker({lng, lat});
    } catch (error) {
      return showToast('Failed to find address, try clicking the map');
    }
  }

  useEffect(() => { if (meetingMapShown && meetingMapContainerRef.current) { renderMeetingMap(); } }, [meetingMapShown, meetingMapContainerRef.current]);


  //destination map values & functions:
  const [destinationMapShown, setDestinationMapShown] = useState(false);
  const [destinationAddress, setDestinationAddress] = useState('');
  const destinationMapContainerRef = useRef<HTMLDivElement | null>(null);
  const destinationMapRef = useRef<mapboxgl.Map | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { renderMap: renderDestinationMap, removeMap: removeDestinationMap, getCoordsFromAddress: getDestinationCoords, placeMarker: placeDestinationMarker } = useMap({
    initialCoords: initialCoords,
    onMapClick: onDestinationMapClick,
    meetingMapRef: destinationMapRef,
    meetingMarkerRef: destinationMarkerRef,
    meetingMapContainerRef: destinationMapContainerRef,
  });

  async function onDestinationMapClick(event: any) {
    const { lng, lat } = event;
    handleChange({ name: 'destinationCoords', value: { destinationLat: lat, destinationLng: lng } });
    clearDestinationAddressInput()
  }

  function handleDestinationAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDestinationAddress(e.target.value);
  }

  function toggleDestinationMap() {
    if (!destinationMapShown) {
      setDestinationMapShown(true);
    } else {
      removeDestinationMap();
      setDestinationMapShown(false);
      clearDestinationAddressInput()
    }
  }

  function clearDestinationAddressInput() {
    setDestinationAddress('');
  }

  async function destinationAddressToCoords(address: string) {
    try {
      if (!address || address.length < 6) return showToast('Please enter a valid address');
      const res = await getCoordsFromAddress(address); if (!res.coords?.lat) throw new Error('Coords not found');
      const { lat, lng } = res.coords!;
      handleChange({ name: 'destinationCoords', value: {lat, lng} });
      placeDestinationMarker({lng, lat});
    } catch (error) {
      return showToast('Failed to find address, try clicking the map');
    }
  }

  useEffect(() => { if (destinationMapShown && destinationMapContainerRef.current) { renderDestinationMap(); } }, [destinationMapShown, destinationMapContainerRef.current]);


  //other functions
  function mapCategoriesToOptions() {
    const options = [];
    for (const category of categories) {
      options.push({value: category.id, label: category.name});
    }
    return options
  }


  //render:
  return (
    <aside className='w-[100%] flex flex-col my-4'>

      {/* instructions text */}
      <ContentSectionHeader text='Add More Details' style={{lineHeight: '2rem', fontSize: '1.5rem'}} />
      <ContentSectionDescription text='Add more details to find' className='text-xl xs:text-xl md:text-xl'/>
      <ContentSectionDescription text='like-minded companions easier' className='text-xl xs:text-xl md:text-xl mb-4'/>
      
      {/* image preview */}
      <div 
        className='rounded-2xl bg-lightgray w-[100%] h-[20rem] mb-4 relative cursor-pointer'
        style = {imagePreview ? {backgroundImage: `url(${imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'} : {}}
      >
        <p className='absolute top-4 right-4 text-darkgray text-2xl cursor-pointer'> <LuImagePlus /> </p>
        {!imagePreview && <span className='absolute top-4 left-8 text-darkgray font-semibold text-xl'>upload image</span>}
        <input type="file" max={1} multiple={false} accept='image/*' className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
      </div>

      {/* requirements, keyWords, category */}
      <InputTextarea inputName='requirements' labelText='requirements' value={trip.requirements!} onChange={handleChange} disabled={loading} className='mb-4'/>
      <InputText inputName='keyWords' labelText={trip.keyWords ? 'key words' : 'key words (comma separated)'} value={trip.keyWords!} onChange={handleChange} disabled={loading} className='mb-4' />
      <InputSelect inputName='category' labelText='category' value={trip.category!} onChange={handleChange} options={mapCategoriesToOptions()} disabled={loading} className='mb-4' />

      {/* meeting point on map */}
      <ContentSectionButton text='Meeting Point Map' onClick={toggleMeetingMap} className='mb-4' />
      {
        meetingMapShown
        && 
        <>
          <ContentSectionDescription text={`Click the meeting place on the map or type address into the 'meeting address' input under the map`} className='text-lg xs:text-lg md:text-lg font-normal mb-4'/>
          <div id="meeting-point-map" className='w-[100%] min-h-[20rem] mb-4' ref={meetingMapContainerRef} />
          <ContentSectionDescription text={`Enter meeting address (or click the map above)`} className='text-lg xs:text-lg md:text-lg font-normal mb-4'/>
          <InputText inputName='meetingAddress' labelText='meeting address' value={meetingAddress} onChange={handleMeetingAddressChange} disabled={loading} className='mb-4'>
            <button type='button' onClick={() => meetingAddressToCoords(meetingAddress)} className='absolute top-[50%] right-1 -translate-y-[50%] bg-textorange text-white text-xs font-semibold rounded-full w-[3rem] h-[3rem] shadow-md'>
              FIND
            </button>
          </InputText>
        </>
      }

      {/* destination on map */}
      <ContentSectionButton text='Destination Map' onClick={toggleDestinationMap} className='mb-4' />
      {
        destinationMapShown
        &&
        <>
          <ContentSectionDescription text={`Click where you are going on the map or type address into the 'destination address' input under the map`} className='text-lg xs:text-lg md:text-lg font-normal mb-4'/>
          <div id="destination-map" className='w-[100%] min-h-[20rem] mb-4' ref={destinationMapContainerRef} />
          <ContentSectionDescription text={`Enter destination address (or click the map above)`} className='text-lg xs:text-lg md:text-lg font-normal mb-4'/>
          <InputText inputName='destinationAddress' labelText='destination address' value={destinationAddress} onChange={handleDestinationAddressChange} disabled={loading} className='mb-4'>
            <button type='button' onClick={() => destinationAddressToCoords(destinationAddress)} className='absolute top-[50%] right-1 -translate-y-[50%] bg-textorange text-white text-xs font-semibold rounded-full w-[3rem] h-[3rem] shadow-md'>
              FIND
            </button>
          </InputText>
        </>
      }
    </aside>
  )
}

export default TripDetails