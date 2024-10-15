'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GradientDescription from '@/components/GradientDescription';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import { useWS } from '@/context/wsContext';
import { Group, Post, UserProfile } from '@/types';
import { useToast } from '@/context/toastContext';
import { useAuth } from '@/context/authContext';
import { apiCalls } from '@/utils/apiCalls';
import { scrollToElement } from '@/utils/DOM';
import PostCard from '@/components/PostCard';
import InputPost from '@/components/InputPost';



interface PostInput {
  body: string;
  groupId: string;
  postedBy: string;
  images?: string[];
}



const hint = 'Write something...'	



const GroupPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { connect, disconnect, isConnected, message, sendMessage } = useWS();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState('');
  const [previews, setPreviews] = useState([]);
  const [imageFileNames, setImagesFileNames] = useState([])
  const emailUserPairs = groupUsers.length //{email: UserProfile};
    ?
    groupUsers.reduce((acc: {[key: string]: UserProfile}, user: UserProfile) => { acc[user.email] = user; return acc;}, {})  
    : 
    {}


  function getPosts() { sendMessage({action: 'postGet', groupId: id}); }

  function createPost(postInput: PostInput) { sendMessage({action: 'postCreate', post: postInput}); }

  async function getGroup() {
    const res = await apiCalls.get(`/groups?id=${id}`);
    if (res.error) return showToast('Failed to fetch Group info');
    else setGroup(res);
  }

  async function getUsers() {
    const res = await apiCalls.post('/usersbatchget', { emails: group?.members });
    if (res.error) return showToast('Failed to fetch Group members');
    else setGroupUsers(res);
  }

  function handleWsMessages(message: any) {
    if (message?.action === 'posts') {
      if (message.error) { console.log(message.error); return showToast('Failed to get posts'); }
      else setPosts(message.posts);
    }
    if (message?.action === 'postCreate') {
      if (message.error) handlePostFail(message.error); 
      else handlePostSuccess(message.post); 
    }
  }

  function handlePostFail(error: any) {
    console.log(error);
    setLoading(false);
    showToast('Failed to save post');
  }

  function handlePostSuccess(post: Post) {
    setPosts(prev => { const updatedPosts = [post, ...prev]; return updatedPosts; });
    setLoading(false);
    setPost(hint);
    setPreviews([]);
    setImagesFileNames([]);
    showToast('Posted');
    setTimeout(() => { scrollToElement(post.id) }, 100);
  }

  function onChange(event: {name: string, value: any}) {
    if (event.name === 'post') setPost(event.value);
    if (event.name === 'previews') { setPreviews(event.value.previews); setImagesFileNames(event.value.fileNames); }
  }

  function onSubmit() {
    handlePreSubmit();
    createPost({postedBy: user.email, body: post, groupId: id, images: []});
  }

  function handlePreSubmit() {
    if ((!post && previews.length === 0) || (post === hint)) return showToast('Please enter a post');
    setLoading(true);
  }


  useEffect(() => { //connect/disconnect to ws when user comes to/leaves the page
    if (id && !isConnected) { connect(id as string); }
    return () => { if (isConnected) { disconnect(); } };
  }, [id, isConnected]);

  useEffect(() => { if (id) getGroup(); }, [id]); //get group data

  useEffect(() => { if (group) getUsers(); }, [group]); //get group users

  useEffect(() => { if (id && isConnected) getPosts(); }, [id, isConnected]); //request group posts on page load

  useEffect(() => { handleWsMessages(message) }, [message]); //catch and handle ws post messages


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
        {
          group && groupUsers.length > 0
          &&
          <Container className='px-4'>
            <ContentSectionHeader text={group.name.toUpperCase()} />
            <ContentSectionDescription text='Discuss in privacy of your group.' className='mb-20'/>
          </Container>
        }
        <Container className='px-4 max-w-[500px]'>
          {group?.id && <InputPost onChange={onChange} onSubmit={onSubmit} loading={loading} post={post} previews={previews} />}
          {posts.map((post) => (<PostCard key={post.id} post={post} userProfile={emailUserPairs[post.postedBy]} />))}
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  );
}

export default GroupPage;
