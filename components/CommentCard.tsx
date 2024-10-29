'use client'

import React, { useEffect, useState } from 'react';
import CenteredImage from './CenteredImage';
import { FaTrashAlt } from 'react-icons/fa';
import { Comment, UserProfile } from '@/types';
import { formatUTCToDateAndHour } from '@/utils/dates';
import { apiCalls } from '@/utils/apiCalls';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/context/toastContext';



interface Props {
  comment: Comment;
  deleteComment: (id: string) => void;
}



const CommentCard = ({ comment, deleteComment }: Props) => {
  const [postedBy, setPostedBy] = useState<UserProfile>({nickname: '', profilePicture: '', about: '', email: '', groups: []});
  const { user } = useAuth();
  const { showToast } = useToast();


  async function fetchUser() {
    const res = await apiCalls.post('/users', {email: comment.by});
    if (res.error) { console.log(res.error); return; }
    setPostedBy({...res});
  }

  function onDelete() { deleteComment(comment.id); }


  useEffect(() => { fetchUser(); }, []); //get commenter's data to show in the card


  return (
    <section className='w-[100%] relative bg-gradient-to-r from-[#f0f0f0] to-white p-4 mb-4 shadow-md rounded-xl' id={comment.id}>
      {/* delete comment btn */}
      {(user?.email === postedBy.email || user.isAdmin) && <p onClick={onDelete} className='absolute top-4 right-2 cursor-pointer'> <FaTrashAlt /> </p>}

      {/* image, postedBy & date */}
      <div className='w-[100%] flex gap-4 mb-4 pr-4'>
        <CenteredImage width={50} height={50} src={postedBy.profilePicture || '/images/user.png'} className='rounded-full min-w-[50px]' />
        <div>
          {postedBy.email && <h4 className='font-bold text-md sm:text-xl break-all'>{postedBy.nickname || postedBy.email.split('@')[0]}</h4>}
          <p className='text-xs sm:text:sm font-light break-all'>{formatUTCToDateAndHour(comment.createdAt)}</p>
        </div>
      </div>

      {/* comment body */}
      <p className='text-lg text-left'>{comment.body}</p>
      {comment.image && <CenteredImage width={150} height={150} src={comment.image} className='rounded-xl mt-4' />}
    </section>
  )
}

export default CommentCard