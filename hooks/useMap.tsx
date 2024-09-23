import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapMouseEvent } from 'mapbox-gl';



mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;



interface UseMapProps {
  initialCoords: [number, number];
  onMapClick: (coords: { lng: number, lat: number }) => void;
  meetingMapContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  meetingMapRef: React.MutableRefObject<mapboxgl.Map | null>;
  meetingMarkerRef: React.MutableRefObject<mapboxgl.Marker | null>;
}



export const useMap = ({
  initialCoords,
  onMapClick,
  meetingMapRef,
  meetingMarkerRef,
  meetingMapContainerRef,
}: UseMapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  function renderMap() {
    if (!meetingMapRef.current && meetingMapContainerRef.current) {
      meetingMapRef.current = new mapboxgl.Map({
        container: meetingMapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: initialCoords,
        zoom: 12,
      });
      meetingMapRef.current.on('click', (event) => {
        const { lng, lat } = event.lngLat;
        placeMarker({lng, lat});
        onMapClick({ lng, lat });  //passed from parent - so it can do stuff with lng & lat
      });
      setMapLoaded(true);
    }
  };

  function removeMap() {
    if (meetingMapRef.current) {
      meetingMapRef.current.remove();
      meetingMapRef.current = null;
      setMapLoaded(false);
    }
  };

  function placeMarker(coords: {lng: number, lat: number}) {
    const { lng, lat } = coords;
    if (meetingMarkerRef.current) { meetingMarkerRef.current.remove(); }
    meetingMarkerRef.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(meetingMapRef.current!);
    meetingMapRef.current!.setCenter([lng, lat]);
  }

  async function getAddressFromCoords(coords: { lng: number, lat: number }) {
    try {
      const { lng, lat } = coords;
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
      const data = await response.json();
      return {address: data.features[0].place_name, error: ''};
    } catch (error) {
      console.log(error);
      return {address: '', error: 'Failed to get address from coordinates'};
    }
  }

  async function getCoordsFromAddress(address: string) {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
      const data = await response.json(); if (data.features.length === 0) throw new Error("No coordinates found for this address"); 
      const { center } = data.features[0]; // center contains [lng, lat]
      return { coords: { lng: center[0], lat: center[1] }, error: '' };
    } catch (error) {
      console.log(error);
      return { coords: null, error: 'Failed to get coordinates from address' };
    }
  }


  useEffect(() => {
    return () => { removeMap(); };
  }, []);


  return {
    renderMap,
    removeMap,
    placeMarker,
    mapLoaded,
    getAddressFromCoords,
    getCoordsFromAddress
  };
};