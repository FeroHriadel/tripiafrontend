'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import GradientDescription from '@/components/GradientDescription';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import { useWS } from '@/context/wsContext';

const GroupPage = () => {
  const params = useParams();
  const id = params.id;
  const { connect, disconnect, isConnected, message, sendMessage } = useWS();


  // useEffect(() => {
  //   if (isConnected && id) {
  //     const post = {postedBy: 'ferdinand.hriadel@gmail.com', body: 'Hi', images: [], groupId: id};
  //     const msg = {action: 'postCreate', post } 
  //     sendMessage(msg);
  //   }
  // }, [isConnected, id]);
  

  useEffect(() => {
    if (id && !isConnected) {
      connect(id as string);
    }
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [id, isConnected]);


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='GROUP CHAT' className='text-center mb-4' />
          <GradientDescription 
            text={`Discuss trip details, make plans together and share photos in private.`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4 max-w-[500px]'>

        </Container>
      </ContentSection>
    </>
  );
}

export default GroupPage;
