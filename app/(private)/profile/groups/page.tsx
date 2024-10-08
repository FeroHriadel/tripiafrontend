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
import { Group } from '@/types';



const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();
  

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

  function handleSuccess(res: Group) {
    setLoading(false);
    showToast('Group created successfully');
    setGroups(sortGroupsAlphabetically([...groups, res]));
    closeModal();
  }

  async function handleCreateGroup() {
    handlePreSubmit();
    const res = await saveGroupInDb(); 
    if (res.error) return handleFail('Failed to save group');
    else handleSuccess(res);
  }

  async function getGroups() {
    const res = await apiCalls.get(`/groups`);
    if (res.error) return handleFail('Failed to get groups')
    else { setGroups(sortGroupsAlphabetically(res)); setLoading(false); };
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


  useEffect(() => { if (user.email) getGroups();  }, [user.email]); //get user's groups


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
          {groups.map((group) => <GroupCard key={group.id} group={group} style={{marginBottom: '1rem'}} />)}
          <ContentSectionButton text='Add New' onClick={openModal} className='mt-4' />
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