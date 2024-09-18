'use client'

import React, { useEffect, useState } from 'react'
import CenteredImage from './CenteredImage';
import { FaPenFancy, FaTrashAlt, FaRegStar, FaStar } from 'react-icons/fa';
import Tag from './Tag';
import ContentSectionButton from './ContentSectionButton';
import { Trip } from '@/types';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '@/context/authContext';
import { apiCalls } from '@/utils/apiCalls';
import { setFavoriteTrips } from '@/redux/slices/favoriteTripsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';



export const dynamic = 'force-dynamic';



interface Props {
  trip: Trip;
  onDelete?: (id: string) => void;
  className?: string;
  style?: {[key: string]: string | number};
  id?: string;
  searchword?: string;
}



const TripCard = ({ trip, className = '', style = {}, id, searchword = '', onDelete = () => {} }: Props) => {
  const [profilePicture, setProfilePicture] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [starClickDisabled, setStarClickDisabled] = useState(false);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const favoriteTrips = useAppSelector((state) => state.favoriteTrips);


  function openConfirm() { setConfirmOpen(true); }

  function closeConfirm() { setConfirmOpen(false); }

  async function deleteTrip() { closeConfirm(); onDelete(trip.id!); }

  function HighlightSearchword({ text, searchword }: { text: string; searchword: string; }) {
    if (!searchword) return <>{text}</>;
    const regex = new RegExp(`(${searchword})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) 
          ? (<span key={index} className="bg-textorange">{part}</span>) 
          : (part)
        )}
      </>
    );
  }

  async function getProfilePicture(email: string | undefined) {
    if (!email) return;
    const body = { email };
    const res = await apiCalls.post('/users', body);
    if (res.profilePicture) setProfilePicture(res.profilePicture); 
  }

  async function addToFavorites() {
    if (starClickDisabled) return;
    setStarClickDisabled(true);
    const newFavoriteTrips = [...favoriteTrips, trip.id!];
    dispatch(setFavoriteTrips(newFavoriteTrips));
    await apiCalls.post('/favoritetrips', {tripIds: newFavoriteTrips});
    setStarClickDisabled(false);
  }

  async function removeFromFavorites() {
    if (starClickDisabled) return;
    setStarClickDisabled(true);
    const newFavoriteTrips = favoriteTrips.filter(id => id !== trip.id!);
    dispatch(setFavoriteTrips(newFavoriteTrips));
    await apiCalls.post('/favoritetrips', {tripIds: newFavoriteTrips});
    setStarClickDisabled(false);
  }

  function isFavorite() {
    return favoriteTrips.includes(trip.id!);
  }

  async function toggleFavoriteTrip() {
    if (isFavorite()) await removeFromFavorites();
    else await addToFavorites();
  }


  useEffect(() => { getProfilePicture(trip.createdBy); }, [])


  return (
    <div 
      className={`---card-container--- w-[100%] bg-gradient-to-l from-gray-200 to-white px-4 py-4 font-xl sm:text-xl text-base rounded-2xl ` + className}
      style={{boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)' , ...style}}
      id={id}
    >

      {/* user's image, trip name, category & icons */}
      <div className='---image-name-and-icons-container--- flex justify-between mb-4'>
        <div className="---left-image-and-text--- flex">
          <CenteredImage 
            src={profilePicture || '/images/user.png'}
            widthOptimization={100}
            heightOptimization={100}
            width={100} 
            height={100} 
            className='rounded-full max-w-[50px] max-h-[50px] sm:max-w-[100px] sm:max-h-[100px] mr-4'
          />

          <div className='---name-and-category---'>
            <p className='font-semibold'> <HighlightSearchword text={trip.name} searchword={searchword} /> </p>
            {trip.category && <small>{trip.category}</small>}
            <p className='text-xs'>by <HighlightSearchword text={trip.nickname!} searchword={searchword} /> </p>
          </div>
        </div>

        {
          user.email
          &&
          <div className="---right-icons-container--- flex flex-col sm:flex-row gap-4 sm:gap-2">
            {(user.isAdmin || user.email === trip.createdBy) && <p className='cursor-pointer' onClick={openConfirm}><FaTrashAlt /></p>}
            {(user.isAdmin || user.email === trip.createdBy) && <p className='cursor-pointer'><FaPenFancy /></p>}
            {
              user.email !== trip.createdBy && <p className='cursor-pointer' style={{color: '#F48957'}} onClick={toggleFavoriteTrip}>
                {isFavorite() ? <FaStar /> : <FaRegStar />}
              </p>
            }
          </div>
        }
      </div>

      {/* description */}
      <div className="---description-container--- mb-4">
        <p> <HighlightSearchword text={trip.description} searchword={searchword} /> </p>
      </div>

      {/* image */}
      {
        trip.image
        &&
        <div className="---image-container--- mb-4">
          <CenteredImage 
            src='/images/user.png'
            width={'100%'} 
            height={500} 
            className='rounded-2xl mr-4 max-h-[300px] xs:max-h-[500px]'
          />
        </div>
      }

      {/* keyWords (tags) */}
      {
        trip.keyWords && trip.keyWords.length >= 1
        &&
        <div className="---key-words--- flex gap-2 mb-4">
          {
            trip.keyWords.map((keyWord, idx) => (
              <Tag text={keyWord} key={keyWord + idx} />
            ))
          }
        </div>

      }
      <ContentSectionButton text='View Details' />

      <ConfirmDialog open={confirmOpen} onClose={closeConfirm} onConfirm={deleteTrip} text={`Do you want to permanently delete this trip?`} />
    </div>
  )
}

export default TripCard