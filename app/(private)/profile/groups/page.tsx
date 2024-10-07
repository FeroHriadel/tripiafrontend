'use client'

import React, { useState, useEffect } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import ContentSectionButton from '@/components/ContentSectionButton';
import InputText from '@/components/InputText';
import Modal from '@/components/Modal';
import { useToast } from '@/context/toastContext';


const GroupsPage = () => {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();
  

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

  function handlePreSubmit() {
    if (!isGroupnameOk()) return;
    setLoading(true);
  }

  async function handleCreateGroup() {
    handlePreSubmit();
  }

  function renderModalContent() {
    return (
      <div className='w-[100%]'>
        <br />
        <InputText inputName='groupName' labelText='group name' value={groupName} onChange={handleChange} disabled={loading} className='mb-8' />
        <ContentSectionButton text='OK' onClick={closeModal} className='mb-4' />
        <ContentSectionButton text='Cancel' onClick={closeModal} className='mb-4' />
      </div>
    );
  }


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

          <ContentSectionButton text='Create a Group' onClick={openModal} />
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