'use client'

import React from 'react';
import Container from '@/components/Container';
import ContentSectionHeader from '../components/ContentSectionHeader';
import InputComment from './InputComment';
import CommentCard from './CommentCard';
import { Trip, Comment } from '@/types';
import { uploadImage } from '@/utils/imageUpload';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/context/toastContext';
import { apiCalls } from '@/utils/apiCalls';
import { scrollToElement } from '@/utils/DOM';



interface Props {
  trip: Trip;
}



const sampleComments: Comment[] = [
  {id: 'snsklnfl3pinmdf03c', by: 'ferdinand.hriadel@gmail.com', body: 'This is a sample comment', createdAt: new Date().toISOString(), trip: 'dkd3ddoekjfpewmfpe', image: 'https://tripia-devimages-bucket-ioioioi.s3.us-east-1.amazonaws.com/2024-08NT-NaChabenci.jpg92836.png'},
  {id: 'snsklnfl3pinmdf4,ot94c', by: 'emaletester0@gmail.com', body: 'This is a sample comment efoepfmp fmefmewkfmewk', createdAt: new Date().toISOString(), trip: 'dkd3ddoekjfpewmfpe', image: ''},
]

const hint = 'Write something...'	



const TripComments = ({ trip }: Props) => {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [comment, setComment] = React.useState(hint);
  const [preview, setPreview] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
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
    setComment('Write something...');
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


  return (
    <Container className='px-4 mt-10'>
      <ContentSectionHeader text='Comments' style={{lineHeight: '2rem', fontSize: '2rem', textAlign: 'left'}} className='mb-2' />
      <InputComment onChange={onChange} comment={comment} preview={preview} onSubmit={onSubmit} loading={isUploading} />
      {comments.map(comment => ( <CommentCard comment={comment} key={comment.id} /> ))}
    </Container>
  )
}

export default TripComments