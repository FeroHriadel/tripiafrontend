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
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { setProfile } from '@/redux/slices/profileSlice';
import { FaTrashAlt } from 'react-icons/fa';



interface Props {
  group: Group | null;
  groupUsers: UserProfile[];
  setGroupUsers: (user: UserProfile[]) => void;
}



const maxUsersPerInvite = 10;



const GroupModalContent = ({ group, groupUsers, setGroupUsers }: Props) => {
  const params = useParams();
  const groupId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);
  const { showToast } = useToast();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.profile)
  

  function onUserSelect(selectedUser: UserProfile) {
    if (selectedUsers.find(u => u.email === selectedUser.email)) return;
    if (selectedUsers.length > maxUsersPerInvite ) return showToast(`Only ${maxUsersPerInvite} invitations at a time are possible`);
    setSelectedUsers([...selectedUsers, selectedUser]);
  }

  function removeUser(removedUser: UserProfile) { 
    setSelectedUsers(selectedUsers.filter(u => u.email !== removedUser.email))
  };

  async function getProfile() {
    if (profile.email) return;
    const res = await apiCalls.post('/users', {email: user.email});
    if (res.error) return showToast('Failed to load your info');
    else dispatch(setProfile(res));
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

  async function removeUserFromGroup(userToRemove: UserProfile) {
    if (userToRemove?.email === user.email) return showToast('Cannot remove yourself. You may delete the group, though.');
    showToast('Removing user from group...');
    const res = await apiCalls.put(`/groups/${groupId}`, {email: userToRemove?.email});
    if (res.error) return handleRemoveUserError(res.error);
    else return handleRemoveUserSuccess(userToRemove);
  }

  function handleRemoveUserError(text: string) { showToast(text); }

  function handleRemoveUserSuccess(userToRemove: UserProfile) {
    const newUsers = [...groupUsers.filter(u => u.email !== userToRemove.email)]
    showToast('User removed');
    setGroupUsers([...groupUsers.filter(u => u.email !== userToRemove?.email)]);
  }

  
  useEffect(() => { if (user.email && !profile.email) getProfile(); }, [user, profile]); //get group owner's profile just in case it was not loaded before for a reason


  return (
    <>
      <div className='w-[100%]'>
        {
          (!group || !profile)
          ?
          <p className='text-center'>Loading...</p>
          :
          // add user input
          <section>
            <p className='text-xs mb-4 mt-10'>Search people by username. Enter first 2 letters to start searching. Click found users to add them to invitation </p>
            <InputUsersSearch onUserSelected={onUserSelect} className='mb-4' />
            {
              selectedUsers.length > 0
              &&
              <p className='text-sm'> 
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
            <ContentSectionButton 
              text='Invite' 
              className={`${selectedUsers.length ? 'my-4' : 'mb-4'}`} 
              disabled={loading} 
              onClick={inviteSelectedUsers} 
            />


            {/* group members */}
            {groupUsers.length > 1 && <p className='text-xs mb-4 mt-10'>View people in your Group.</p>}
            {
              groupUsers.map((groupUser: UserProfile) => (
                groupUser.email !== user.email
                &&
                <div key={groupUser.email} className='w-[100%] flex text-left'>
                  <p className='text-sm w-[100%]'>{groupUser.nickname}</p>
                  <span className='flex gap-2 text-sm'>
                    <FaTrashAlt className='cursor-pointer text-sm' onClick={() => removeUserFromGroup(groupUser)} />
                  </span>
                </div>
              ))
            }
          </section>
        }
      </div>
    </>
  )
}

export default GroupModalContent