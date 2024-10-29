'use client'

import React from 'react';
import CenteredImage from '@/components/CenteredImage';
import { FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '@/context/authContext';
import { Post, UserProfile } from '../types';
import { formatUTCToDateAndHour } from '@/utils/dates';
import { FaDownload } from 'react-icons/fa6';
import { useToast } from '@/context/toastContext';
import { useWS } from '@/context/wsContext';



interface Props {
  post: Post;
  userProfile: UserProfile;
  deletePost: (id: string) => void;
}

const PostCard = ({ post, userProfile, deletePost }: Props) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { sendMessage, isConnected, connect } = useWS();


  function handleDelete() { deletePost(post.id); }

  function downloadImage(image: string) {
    fetch(image)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const randomFileName = Math.random().toString(36).substring(2, 15) + ".png";
        link.download = randomFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        showToast('Failed to download image');
        console.error('There was an error downloading the image:', error);
      });
  }

  function renderSingleImage(image: string) {
    return (
      <div className='w-[100%] mb-2 relative'>
        <div 
          style={{
            background: `url(${image}) no-repeat center center`,
            backgroundSize: 'cover',
            aspectRatio: '1 / 1',
          }} 
          className='h-auto w-full rounded-xl' 
        />
        <p 
              className='absolute bottom-2 right-2 cursor-pointer text-white rounded-full bg-textorange shadow-xl p-2' 
              onClick={() => downloadImage(image)}
            > 
              <FaDownload /> 
            </p>
      </div>
    );
  }

  function renderTwoImages(images: string[]) {
    return (
      <div className='flex gap-2'>
        {images.map((image, idx) => (
          <div 
            key={idx} 
            className='relative flex-1 min-w-0'
          >
            <div 
              style={{
                background: `url(${image}) no-repeat center center`,
                backgroundSize: 'cover',
                aspectRatio: '1 / 1',
              }} 
              className='h-46 sm:h-72 w-full rounded-xl' 
            />
            <p 
              className='absolute bottom-2 right-2 cursor-pointer text-white rounded-full bg-textorange shadow-xl p-2' 
              onClick={() => downloadImage(image)}
            > 
              <FaDownload /> 
            </p>
          </div>
        ))}
      </div>
    );
  }

  function renderMultipleImages(images: string[]) {
    return (
      <div className='grid grid-cols-3 gap-2'>
        {images.map((image, idx) => (
          <div 
            key={idx} 
            className='relative'
          >
            <div 
              style={{
                background: `url(${image}) no-repeat center center`,
                backgroundSize: 'cover',
                aspectRatio: '1 / 1',
              }} 
              className='h-28 sm:h-40 w-full rounded-xl' 
            />
            <p 
              className='absolute bottom-2 right-2 cursor-pointer text-white rounded-full bg-textorange shadow-xl p-2' 
              onClick={() => downloadImage(image)}
            > 
              <FaDownload /> 
            </p>
          </div>
        ))}
      </div>
    );
  }

  function renderImages() {
    if (post.images.length === 1) {
      return renderSingleImage(post.images[0]);
    } else if (post.images.length === 2) {
      return renderTwoImages(post.images);
    } else {
      return renderMultipleImages(post.images);
    }
  }

  
  return (
    <section className='w-[100%] relative bg-gradient-to-r from-[#f0f0f0] to-white p-4 mb-4 shadow-md rounded-xl' id={post.id}>
      {/* delete post btn */}
      {(user?.email === post.postedBy || user.isAdmin) && <p onClick={handleDelete} className='absolute top-4 right-2 cursor-pointer'> <FaTrashAlt /> </p>}

      {/* profile image, postedBy & date */}
      {userProfile && (
        <div className='w-[100%] flex gap-4 mb-4 pr-4'>
          <CenteredImage width={50} height={50} src={userProfile.profilePicture || '/images/user.png'} className='rounded-full min-w-[50px]' />
          <div>
            {userProfile.email && <h4 className='font-bold text-md sm:text-xl break-all'>{userProfile.nickname || userProfile.email.split('@')[0]}</h4>}
            <p className='text-xs sm:text:sm font-light break-all'>{formatUTCToDateAndHour(post.createdAt)}</p>
          </div>
        </div>
      )}

      {/* post body */}
      <p className='text-base xs:text-xl mb-4'>{post.body}</p>

      {/* post images */}
      {renderImages()}
    </section>
  );
}

export default PostCard;
