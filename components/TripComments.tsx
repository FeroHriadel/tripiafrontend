'use client'

import React, { useEffect, useState } from 'react';
import Container from '@/components/Container';
import ContentSectionHeader from '../components/ContentSectionHeader';
import InputComment from './InputComment';
import CommentCard from './CommentCard';
import { Trip, Comment } from '@/types';
import { uploadImage } from '@/utils/imageUpload';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/context/toastContext';
import { apiCalls, uriEncodeObj } from '@/utils/apiCalls';
import { scrollToElement } from '@/utils/DOM';



interface Props {
  trip: Trip;
}



const hint = 'Write something...';
const pageSize = 3;



const TripComments = ({ trip }: Props) => {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = React.useState<{[key: string]: any} | null>(null);
  const [comment, setComment] = React.useState(hint);
  const [preview, setPreview] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();


  function onChange(event: {name: string, value: any}) {
    if (event.name === 'comment') setComment(event.value);
    if (event.name === 'preview') { setPreview(event.value.preview); setFileName(event.value.fileName); }
  }

  async function uploadImageToS3() {
    if (!preview) return {imageUrl: '', error: ''};
    const res = await uploadImage(fileName, preview, user.idToken);
    return res;
  }

  async function saveCommentToDb(commentImageUrl: string) {
    const body = {
      by: user.email, 
      body: comment, 
      trip: trip.id, 
      image: commentImageUrl,
      createdAt: new Date().toISOString()  
    }
    const res = await apiCalls.post('/comments', body);
    return res;
  }

  function handleFail(error?: string) { 
    setIsUploading(false); 
    if (error) showToast(error)
    else showToast('Failed to save comment');
  }

  function handleSuccess(savedComment: Comment) {
    setIsUploading(false);
    setComments([savedComment, ...comments]);
    setComment(hint);
    setPreview('');
    setFileName('');
    setTimeout(() => scrollToElement(savedComment.id), 250)
  }

  async function onSubmit() {
    if (isUploading) return; setIsUploading(true);
    const imageUploadRes = await uploadImageToS3(); if (imageUploadRes.error) return handleFail('Failed to upload image');
    const saveCommentRes = await saveCommentToDb(imageUploadRes.imageUrl || ''); 
    if (saveCommentRes.error) return handleFail('Failed to save comment');
    handleSuccess(saveCommentRes);
  }

  async function fetchCommentsFromAPI() {
    const encodedLastEvaluatedKey = lastEvaluatedKey ? uriEncodeObj(lastEvaluatedKey) : null;
    const queryString = encodedLastEvaluatedKey ? `?lastEvaluatedKey=${encodedLastEvaluatedKey}&pageSize=${pageSize}&tripId=${trip.id}` : `?pageSize=${pageSize}&tripId=${trip.id}`;
    const res = await apiCalls.get('/comments' + queryString);
    return res;
  }

  async function loadMoreComments() {
    setLoadingComments(true);
    const res = await fetchCommentsFromAPI();
    if (!res.items) { showToast(res.error || 'Failed to get more trips'); return setLoadingComments(false) }
    setLastEvaluatedKey(res.lastEvaluatedKey);
    setComments([...comments, ...res.items]);
    setLoadingComments(false);
  }

  function isMoreCommentsToLoad() {
    if (lastEvaluatedKey) return true
    else return false;
  }

  //pick up...


  useEffect(() => { loadMoreComments(); }, []); //fetch a couple of comments initially


  return (
    <Container className='px-4 mt-10'>
      <ContentSectionHeader text='Comments' style={{lineHeight: '2rem', fontSize: '2rem', textAlign: 'left'}} className='mb-2' />
      <InputComment onChange={onChange} comment={comment} preview={preview} onSubmit={onSubmit} loading={isUploading} />
      {comments.map(comment => ( <CommentCard comment={comment} key={comment.id} /> ))}
      {loadingComments && <p className='my-4'>Loading...</p>}
    </Container>
  )
}

export default TripComments