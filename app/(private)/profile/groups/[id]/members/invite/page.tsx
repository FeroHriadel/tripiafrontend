'use client'

import React, { useState, useEffect } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import Container from '@/components/Container';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import InputUsersSearch from '@/components/InputUsersSearch';
import ContentSectionButton from '@/components/ContentSectionButton';
import { useParams } from 'next/navigation';
import { useToast } from '@/context/toastContext';
import { useAuth } from '@/context/authContext';
import { apiCalls } from '@/utils/apiCalls';
import { UserProfile } from '@/types';
import { FaTimesCircle } from 'react-icons/fa';



const InvitePage = () => {
  const params = useParams();
  const groupId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);


  function onUserSelect(selectedUser: UserProfile) { setSelectedUsers([...selectedUsers, selectedUser]); }

  function removeUser(removedUser: UserProfile) { setSelectedUsers(selectedUsers.filter(u => u.email !== removedUser.email))};

  function inviteSelectedUsers() {
    setLoading(true);
  }


  return (
    <>
    <GradientFlexi>
      <GradientHeader text='INVITE PEOPLE' className='text-center' />
      <GradientDescription text='Search people and invite them.' className='text-center' />
    </GradientFlexi>

    <ContentSection className='pb-60'>
      <Container className='px-4 max-w-[500px]'>
        <ContentSectionHeader text='Invite People' />
        <ContentSectionDescription text='Search people by username' className='mb-4' />
        <ContentSectionDescription text='Enter first 2 letters to start searching' className='text-xl xs:text-xl md:text-xl' />
        <ContentSectionDescription text='Click found users to add them to invitation' className='text-xl xs:text-xl md:text-xl mb-4' />
        <InputUsersSearch onUserSelected={onUserSelect} className='mb-4' />
        {
          selectedUsers.length > 0
          &&
          <p> 
            <b>Invite:</b>
            {selectedUsers.map((u, idx) => (
              <span key={u.email} className='flex items-center'>
                {u.nickname} 
                {' '} 
                <FaTimesCircle className='ml-1 cursor-pointer' onClick={() => removeUser(u)} /> 
                {(idx < selectedUsers.length-1) ? ',' : ''} 
              </span>
            ))}
          </p>
        }
        <ContentSectionButton text='Invite' className='my-4' onClick={inviteSelectedUsers} />
      </Container>
    </ContentSection>

    <GradientFlexi />
  </>
  )
}

export default InvitePage