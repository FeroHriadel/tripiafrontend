'use client'

import React, { useEffect, useState, useRef } from 'react';
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
import ConfirmDialog from './ModalConfirmDialog';



interface Props {
  trip: Trip;
}



const hint = 'Write something...';
const pageSize = 3;
const twoMinutes = 1000 * 60 * 2;



const TripComments = ({ trip }: Props) => {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = React.useState<{[key: string]: any} | null>(null);
  const [comment, setComment] = React.useState(hint);
  const [preview, setPreview] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [commentToDelete, setCommentToDelete] = React.useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);


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

  function unobserveLastCard() { if (observerRef.current) observerRef.current.disconnect(); }

  function observeLastCard() {
    unobserveLastCard();
    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && isMoreCommentsToLoad()) loadMoreComments();
    });
    if (comments.length > 0) {
      const lastTripIdx = comments.length - 1;
      const lastCardEl = document.getElementById(`${comments[lastTripIdx].id}`);
      if (lastCardEl) observerRef.current.observe(lastCardEl);
    }
  }

  function removeCommentFromState(commentId: string) {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
  }

  function closeConfirm() { 
    setConfirmOpen(false); 
    setCommentToDelete(null);
  }

  function confirmDelete(commentId: string) {
    setCommentToDelete(commentId);
    setConfirmOpen(true);
  }

  async function deleteComment() {
    showToast('Deleting comment...');
    const res = await apiCalls.del('/comments', {id: commentToDelete}); if (res.error) showToast('Failed to delete comment');
    else {  removeCommentFromState(commentToDelete!); showToast('Comment deleted'); }
    closeConfirm();
  }

  function isNewComment(newComments: Comment[]) {
    if (newComments.length === 0) return false;
    if (comments.length === 0) return true;
    if (newComments[0].id === comments[0].id) return false;
    return true;
  }

  async function refreshComments() {
    if (isUploading || loadingComments) return;
    const res = await fetchCommentsFromAPI(); if (!res.items) return;
    if (!isNewComment(res.items)) return;
    setComments(res.items);
    setLastEvaluatedKey(res.lastEvaluatedKey);
    showToast('Someone added a new comment!');
    setTimeout(() => scrollToElement(res.items[0].id), 250);
  }

  function clearRefreshInterval() { clearInterval(refreshInterval.current!); refreshInterval.current = null; }


  useEffect(() => { loadMoreComments(); }, []); //fetch a couple of comments initially

  useEffect(() => { if (comments.length) observeLastCard(); }, [comments]); //will load more comments when last comment shows in viewport

  useEffect(() => { //refresh comments regularly
    clearRefreshInterval();
    refreshInterval.current = setInterval(refreshComments, twoMinutes);
    return () => clearRefreshInterval();
  }, [comments]);


  return (
    <Container className='px-4 mt-10'>
      <ContentSectionHeader text='Comments' style={{lineHeight: '2rem', fontSize: '2rem', textAlign: 'left'}} className='mb-2' />
      <InputComment onChange={onChange} comment={comment} preview={preview} onSubmit={onSubmit} loading={isUploading} />
      {comments.map(comment => ( <CommentCard comment={comment} key={comment.id} deleteComment={confirmDelete} /> ))}
      {loadingComments && <p className='my-4'>Loading...</p>}
      <ConfirmDialog onClose={closeConfirm} open={confirmOpen} onConfirm={deleteComment} text='Delete comment?' />
    </Container>
  )
}

export default TripComments