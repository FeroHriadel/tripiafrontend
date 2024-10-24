'use client'

import React, { useState, useEffect } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import Container from '@/components/Container';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import ConfirmDialog from '@/components/ModalConfirmDialog';
import { TableContainer, TableHeader, TableLine } from '@/components/Table';
import Link from 'next/link';
import { FaPenFancy, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useToast } from '@/context/toastContext';
import { useAuth } from '@/context/authContext';
import { apiCalls } from '@/utils/apiCalls';
import { Group, UserProfile } from '@/types';



export const dynamic = 'force-dynamic';



const GroupMembersPage = () => {
  const params = useParams();
  const groupId = params.id as string;
  const { showToast } = useToast();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<UserProfile[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  

  async function getGroup() {
    const res = await apiCalls.get(`/groups?id=${groupId}`);
    if (res.error) return showToast('Failed to fetch Group info');
    else setGroup(res);
  }

  async function getUsers() {
    const res = await apiCalls.post('/usersbatchget', { emails: group?.members });
    if (res.error) return showToast('Failed to fetch Group members');
    else setGroupUsers(res);
  }

  function openConfirm(userData: UserProfile) {
    setUserToDelete(userData);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
  }

  async function removeUser() {
    closeConfirm();
    if (userToDelete?.email === user.email) return showToast('Cannot remove yourself. You may delete the group, though.');
    showToast('Removing user from group...');
    const res = await apiCalls.put(`/groups/${groupId}`, {email: userToDelete?.email});
    if (res.error) return handleError(res.error);
    else return handleSuccess();
  }

  function handleError(text: string) {
    showToast(text);
    setUserToDelete(null);
  }

  function handleSuccess() {
    setGroupUsers([...groupUsers.filter(u => u.email !== userToDelete?.email)]);
    showToast('User removed');
    setUserToDelete(null);
  }


  useEffect(() => { if (groupId) getGroup(); }, [groupId]); //get group data

  useEffect(() => { if (group) getUsers(); }, [group]); //get group users


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='GROUP MEMBERS' className='text-center mb-4' />
          <GradientDescription 
            text={`Invite or remove people in your group.`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        {
          group && groupUsers.length > 0
          &&

          <Container className='px-4'>
            <ContentSectionHeader text={group.name.toUpperCase()} />
            <ContentSectionDescription text='Add or remove people in your Group.' className='mb-20'/>

            <TableContainer>
            <TableHeader headerText='Group Members' headerContent={<Link href={`/profile/groups/${groupId}/members/invite`}><FaPlus className='cursor-pointer' /></Link>} />
              {
                groupUsers.map((groupUser: UserProfile) => (
                  groupUser.email !== user.email
                  &&
                  <TableLine key={groupUser.email}>
                    <p>{groupUser.nickname}</p>
                    <span className='flex gap-2'>
                      <FaTrashAlt className='cursor-pointer' onClick={() => openConfirm(groupUser)} />
                    </span>
                  </TableLine>
                ))
              }
              {
                groupUsers.length === 1 
                && 
                <TableLine style={{display: 'flex', justifyContent: 'center'}}> 
                  <Link href={`/profile/groups/${groupId}/members/invite`}> <p className='text-center'>It's just you. Invite people</p> </Link> 
                </TableLine>}
            </TableContainer>
          </Container>

            

        }
      </ContentSection>

      <GradientFlexi />
      
      <ConfirmDialog open={confirmOpen} onClose={closeConfirm} onConfirm={removeUser} text={`Do you want to remove user '${userToDelete?.nickname}'?`} />
    </>
  )
}

export default GroupMembersPage