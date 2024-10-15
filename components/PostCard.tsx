import React from 'react';
import CenteredImage from '@/components/CenteredImage';
import { FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '@/context/authContext';
import { Post, UserProfile } from '../types';
import { formatUTCToDateAndHour } from '@/utils/dates';



interface Props {
  post: Post;
  userProfile: UserProfile
}


const PostCard = ({ post, userProfile }: Props) => {
  const { user } = useAuth();

  return (
    <section className='w-[100%] relative bg-gradient-to-r from-[#f0f0f0] to-white p-4 mb-4 shadow-md rounded-xl' id={post.id}>
      {/* delete post btn */}
      {(user?.email === post.postedBy || user.isAdmin) && <p className='absolute top-4 right-2 cursor-pointer'> <FaTrashAlt /> </p>}

      {/* image, postedBy & date */}
      {
        userProfile
        &&
        <div className='w-[100%] flex gap-4 mb-4 pr-4'>
          <CenteredImage width={50} height={50} src={userProfile.profilePicture || '/images/user.png'} className='rounded-full min-w-[50px]' />
          <div>
            {userProfile.email && <h4 className='font-bold text-md sm:text-xl break-all'>{userProfile.nickname || userProfile.email.split('@')[0]}</h4>}
            <p className='text-xs sm:text:sm font-light break-all'>{formatUTCToDateAndHour(post.createdAt)}</p>
          </div>
        </div>
      }

      {/* post body */}
      <p className='text-lg'>{post.body}</p>
    </section>
  )
}

export default PostCard