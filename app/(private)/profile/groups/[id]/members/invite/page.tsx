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
import { Group, UserProfile } from '@/types';
import { FaTimesCircle } from 'react-icons/fa';



const maxUsersPerInvite = 10;



const InvitePage = () => {
  const params = useParams();
  const groupId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  

  function onUserSelect(selectedUser: UserProfile) {
    if (selectedUsers.find(u => u.email === selectedUser.email)) return;
    if (selectedUsers.length > maxUsersPerInvite ) return showToast(`Only ${maxUsersPerInvite} invitations at a time are possible`);
    setSelectedUsers([...selectedUsers, selectedUser]);
  }

  function removeUser(removedUser: UserProfile) { 
    setSelectedUsers(selectedUsers.filter(u => u.email !== removedUser.email))
  };

  async function getProfile() {
    const res = await apiCalls.post('/users', {email: user.email});
    if (res.error) return showToast('Failed to load your info');
    else setProfile(res);
  }

  async function getGroup() {
    const res = await apiCalls.get(`/groups?id=${groupId}`);
    if (res.error) return showToast('Failed to fetch Group info');
    else setGroup(res);
  }

  function getInvitationBody(inviteeEmai: string) {
    return {
      groupId,
      groupName: group?.name,
      invitedByEmail: user.email,
      invitedByNickname: profile?.nickname,
      invitedByImage: profile?.profilePicture || '',
      invitee: inviteeEmai
    }
  }

  function canSubmit() {
    if (!selectedUsers.length) { showToast('Please choose a person to invite'); return false }
    else { showToast('Sending invitations'); setLoading(true); return true }
  }

  async function sendSingleInvitation(inviteeEmail: string) {
    return apiCalls.post('/invitations', getInvitationBody(inviteeEmail))
  }

  function getInvitePromises() {
    const invitePromises = selectedUsers.map(async (selectedUser) => {
      try {
        const invitation = await sendSingleInvitation(selectedUser.email);
        return { [selectedUser.email]: invitation }; // {userEmail: Invitation}
      } catch (error) {
        return { [selectedUser.email]: { error: (error as any).error || JSON.stringify(error) } };  // {userEmail: {error: string}}
      }
    });
    return invitePromises;
  }

  function handleInvitationError(results: {[key: string]: any}[]) {
     const objectsWithErrors = results.filter(obj => { //get failed invitations
      const [email, value] = Object.entries(obj)[0];
      return value.error;
    });
    const errorString = objectsWithErrors //create string: 'nickname1: error1, nickname2: error2'
      .map(obj => {
        const [email, value] = Object.entries(obj)[0];
        const user = selectedUsers.find(user => user.email === email);
        return user ? `${user.nickname}: ${value.error}` : '';
      })
      .filter(str => str !== '')
      .join(', ');
    const selectedUsersWithErrors = selectedUsers.filter(user => //remove successful invites from selectedUsers
      objectsWithErrors.some(obj => {
        const [email, value] = Object.entries(obj)[0];
        return user.email === email && value.error;
      })
    );
    setSelectedUsers(selectedUsersWithErrors);
    showToast(`Failed to invite: ${errorString}`);
    setLoading(false);
  }

  function handleInvitationSuccess() {
    setLoading(false);
    setSelectedUsers([]);
    showToast('Invitations sent');
  }

  async function inviteSelectedUsers() { 
    if (!canSubmit()) return;
    const invitePromises = getInvitePromises();
    const results = await Promise.all(invitePromises);
    if (results.some(result => Object.values(result)[0].error)) handleInvitationError(results);
    else handleInvitationSuccess();
  }
  


  useEffect(() => { if (groupId) getGroup(); }, [groupId]); //get group info

  useEffect(() => { if (user.email) getProfile(); }, [user]); //get group owner's profile


  return (
    <>
    <GradientFlexi>
      <GradientHeader text='INVITE PEOPLE' className='text-center' />
      <GradientDescription text='Search people and invite them.' className='text-center' />
    </GradientFlexi>

    <ContentSection>
      {
        (!group || !profile)
        ?
        <p className='text-center'>Loading...</p>
        :
        <Container className='px-4 max-w-[500px]'>
          <ContentSectionHeader text='Invite People' />
          <ContentSectionDescription text='Search people by username' className='mb-10' />
          <ContentSectionDescription text='Enter first 2 letters to start searching' className='text-xl xs:text-xl md:text-xl' />
          <ContentSectionDescription text='Click found users to add them to invitation' className='text-xl xs:text-xl md:text-xl mb-8' />
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
          <ContentSectionButton text='Invite' className='my-4' disabled={loading} onClick={inviteSelectedUsers} />
        </Container>
      }
    </ContentSection>

    <GradientFlexi />
  </>
  )
}

export default InvitePage