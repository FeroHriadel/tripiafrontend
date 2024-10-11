'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GradientDescription from '@/components/GradientDescription';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import { useWS } from '@/context/wsContext';
import { Post } from '@/types';

const GroupPage = () => {
  const params = useParams();
  const id = params.id;
  const { connect, disconnect, isConnected, message, sendMessage } = useWS();
  const [posts, setPosts] = useState<Post[]>([]);


  function getPosts() { sendMessage({action: 'postGet', groupId: id}); }

  function createPost(post: Post) { sendMessage({action: 'postCreate', post}); }


  useEffect(() => { //connect/disconnect to ws when user comes to/leaves the page
    if (id && !isConnected) { connect(id as string); }
    return () => { if (isConnected) { disconnect(); } };
  }, [id, isConnected]);

  useEffect(() => { if (id && isConnected) getPosts(); }, [id, isConnected]); //request group posts on page load

  useEffect(() => { //catch and handle post messages
    if (message?.action === 'posts') setPosts(message.posts);
    if (message?.action === 'postCreated') setPosts(prev => [...prev, message.post]);
  }, [message]);


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='GROUP CHAT' className='text-center mb-4' />
          <GradientDescription 
            text={`Discuss trip details, make plans and share photos. All in private - group members only.`} 
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
