'use client'

import React, { useEffect, useState } from 'react';
import CenteredImage from './CenteredImage';
import { Comment, UserProfile } from '@/types';
import { formatUTCToDateAndHour } from '@/utils/dates';
import { apiCalls } from '@/utils/apiCalls';
import { useAuth } from '@/context/authContext';



interface Props {
  comment: Comment;
}



const CommentCard = ({ comment }: Props) => {
  const [postedBy, setPostedBy] = useState<UserProfile>({nickname: '', profilePicture: '', about: '', email: ''});
  const { user } = useAuth();


  async function fetchUser() {
    const res = await apiCalls.post('/users', {email: comment.by});
    if (res.error) { console.log(res.error); return; }
    setPostedBy({...res});
  }


  useEffect(() => { fetchUser(); }, []);


  return (
    <section className='w-[100%] bg-gradient-to-r from-[#f0f0f0] to-white p-4 mb-4 shadow-md rounded-xl'>
      {/* image, postedBy & date */}
      <div className='w-[100%] flex gap-4 mb-4'>
        <CenteredImage width={50} height={50} src={postedBy.profilePicture || '/images/user.png'} className='rounded-full min-w-[50px]' />
        <div>
          {
            postedBy.email
            &&
            <h4 className='font-bold text-md sm:text-xl break-all'>{postedBy.nickname || postedBy.email.split('@')[0]}</h4>
          }
          <p className='text-xs sm:text:sm font-light break-all'>{formatUTCToDateAndHour(comment.date)}</p>
        </div>
      </div>

      {/* comment body */}
      <p className='text-lg'>{comment.body}</p>
      {
        comment.image &&
        <CenteredImage width={200} height={200} src={comment.image} className='rounded-xl mt-4' />
      }
    </section>
  )
}

export default CommentCard