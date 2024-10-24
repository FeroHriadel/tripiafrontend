'use client'

import React, { useState, useEffect } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import GroupCard from '@/components/GroupCard';
import ContentSectionButton from '@/components/ContentSectionButton';
import InputText from '@/components/InputText';
import Modal from '@/components/Modal';
import { useToast } from '@/context/toastContext';
import { useAuth } from '@/context/authContext';
import { apiCalls } from '@/utils/apiCalls';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { setProfile } from '@/redux/slices/profileSlice';
import { Group } from '@/types';
import InvitationCard from '@/components/InvitationCard';
import { setInvitations } from '@/redux/slices/invitationsSlice';




const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();
  const invitations = useAppSelector(state => state.invitations);
  const profile = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();
  

  async function loadProfile() {
    if (profile.email) return
    const res = await apiCalls.post('/users', {email: user.email});
    if (res.error) showToast('Failed to load your data');
    else dispatch(setProfile(res));
  };

  async function loadInvitations() {
    if (!user.email) return;
    const res = await apiCalls.get(`/invitations`); 
    if (res.error) console.log('Failed to get invitations: ', res.error);
    if (JSON.stringify(res) === JSON.stringify(invitations)) return;
    dispatch(setInvitations(res));
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) { setGroupName(e.target.value); }

  function closeModal() { 
    setModalOpen(false); 
    setTimeout(() => setGroupName(''), 200);
  }

  function openModal() { setModalOpen(true); }

  function isGroupnameOk() {
    if (!groupName) { showToast('Please enter a group name'); return false }
    else return true
  }

  function sortGroupsAlphabetically(groups: Group[]) { return [...groups].sort((a, b) => a.name.localeCompare(b.name)); }

  function handlePreSubmit() {
    if (!isGroupnameOk()) return;
    setLoading(true);
  }

  async function saveGroupInDb() {
    showToast('Saving group...');
    const res = await apiCalls.post('/groups', { name: groupName });
    return res;
  }

  function handleFail(text?: string) {
    setLoading(false);
    showToast(text || 'Something went wrong');
  }

  function handleCreateSuccess(res: Group) {
    setLoading(false);
    showToast('Group created successfully');
    setGroups(sortGroupsAlphabetically([...groups, res]));
    dispatch(setProfile({ ...profile, groups: [...profile.groups, res.id] }));
    closeModal();
  }

  async function handleCreateGroup() {
    handlePreSubmit();
    const res = await saveGroupInDb(); 
    if (res.error) return handleFail('Failed to save group');
    else handleCreateSuccess(res);
  }

  async function getGroups() {
    if (profile.groups.length === 0) return setLoading(false);
    const res = await apiCalls.post(`/groupsbatchget`, {ids: profile.groups});
    if (res.error) return handleFail('Failed to get groups')
    else { 
      setLoading(false);
      setGroupsLoaded(true);
      setGroups(sortGroupsAlphabetically(res)); setLoading(false);
    };
  }

  function handleDeleteSuccess(groupId: string) {
    setLoading(false);
    showToast('Group deleted');
    const newGroups = groups.filter((group) => group.id !== groupId);
    setGroups(newGroups);
    dispatch(setProfile({ ...profile, groups: profile.groups.filter((id) => id !== groupId) }));
  }

  async function deleteGroup(id: string) {
    setLoading(true);
    const res = await apiCalls.del(`/groups/${id}`); 
    if (res.error) return handleFail('Failed to delete group');
    else handleDeleteSuccess(id);
  }

  function handleUpdateSuccess(props: {groupId: string; name: string}) {
    const newGroups = groups.map((group) => group.id === props.groupId ? { ...group, name: props.name } : group);
    setGroups(sortGroupsAlphabetically(newGroups));
    setLoading(false);
    showToast('Group updated');
  }

  async function updateGroup(props: {groupId: string, name: string}) {
    setLoading(true);
    const { groupId, name } = props;
    const res = await apiCalls.put(`/groups/${groupId}`, { name });
    if (res.error) return handleFail('Failed to update group');
    else handleUpdateSuccess({groupId: groupId, name});
  }

  function onGroupJoin(joinedGroup: Group) {
    /*********************************************************************************************************************************************
      - function split for brevity resons:
      - <InvitationCard />.onAccept() sends api request which: updates Group.members and User.groups & removes invitation from redux invitations
      - this fn rerenders group (adds the accepted one) and adds the group to profile.groups in redux
      - Please update comments in both fns if you change the functionality!
    **********************************************************************************************************************************************/
    const newGroups = [...groups, joinedGroup];
    setGroups(sortGroupsAlphabetically(newGroups));
    dispatch(setProfile({ ...profile, groups: [...profile.groups, joinedGroup.id] }));
  }

  function renderModalContent() {
    return (
      <div className='w-[100%]'>
        <br /><br /><br />
        <InputText inputName='groupName' labelText='group name' value={groupName} onChange={handleChange} disabled={loading} className='mb-8' />
        <ContentSectionButton text='OK' onClick={handleCreateGroup} disabled={loading} className='mb-4' />
        <ContentSectionButton text='Cancel' onClick={closeModal} className='mb-4' />
      </div>
    );
  }


  useEffect(() => { if (user.email) loadProfile(); }, [user.email]); //load user's profile if not preloaded for some reason

  useEffect(() => { if (user.email) loadInvitations(); }, [user.email]); //get fresh invitations 

  useEffect(() => { //get user's groups
    if (user.email && !groupsLoaded) { 
      getGroups();
    } 
  }, [profile.groups, user.email, groupsLoaded]);



  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='MY GROUPS' className='text-center mb-4' />
          <GradientDescription 
            text={`Create a Group or enter a group chat room. Invite people and share trip details with them`}
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='My Groups' />
          <ContentSectionDescription text='Groups you created or have joined' className='mb-20'/>
        </Container>
        <Container className='px-4 max-w-[500px]'>
          {
            /* groups */
            groups.map((group) => <GroupCard key={group.id} group={group} style={{marginBottom: '1rem'}} onDelete={deleteGroup} onUpdate={updateGroup} />)
          }
          <ContentSectionButton text='Add New' onClick={openModal} className='mt-4' />
          {
            /* invitaions */
            invitations.length > 0 
            &&
            <div className='w-[100%] mb-4 mt-20' id='invitations'>
              <ContentSectionHeader text='Invitations' style={{lineHeight: '2rem', fontSize: '1.5rem'}} />
              <ContentSectionDescription text='You have been invited to:' className='text-xl xs:text-xl md:text-xl mb-4'/>
              {invitations.map((invitation) => <InvitationCard key={invitation.id} invitation={invitation} onAccept={onGroupJoin} className='mb-2'/>)}
            </div>
          }
        </Container>
      </ContentSection>

      <GradientFlexi />

      <Modal header='Group Name' text='Please name the group and click OK' open={modalOpen} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </>
  )
}

export default GroupsPage