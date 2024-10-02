'use client'

import React from 'react';
import Container from '@/components/Container';
import ContentSectionHeader from '../components/ContentSectionHeader';
import InputComment from './InputComment';
import { Trip, Comment } from '@/types';
import CenteredImage from './CenteredImage';
import { formatUTCToHumanreadable } from '@/utils/dates';
import CommentCard from './CommentCard';




interface Props {
  trip: Trip;
}



const sampleComments: Comment[] = [
  {id: 'snsklnfl3pinmdf03c', by: 'ferdinand.hriadel@gmail.com', body: 'This is a sample comment', date: new Date().toISOString(), trip: 'dkd3ddoekjfpewmfpe', image: 'https://tripia-devimages-bucket-ioioioi.s3.us-east-1.amazonaws.com/2024-08NT-NaChabenci.jpg92836.png'},
  {id: 'snsklnfl3pinmdf4,ot94c', by: 'emaletester0@gmail.com', body: 'This is a sample comment efoepfmp fmefmewkfmewk', date: new Date().toISOString(), trip: 'dkd3ddoekjfpewmfpe', image: ''},
]



const TripComments = ({ trip }: Props) => {
  const [comment, setComment] = React.useState('Write something...');
  const [preview, setPreview] = React.useState('');
  const [fileName, setFileName] = React.useState('');


  function onChange(event: {name: string, value: any}) {
    if (event.name === 'comment') setComment(event.value);
    if (event.name === 'preview') { setPreview(event.value.preview); setFileName(event.value.fileName); }
  }


  return (
    <Container className='px-4 mt-10'>
      <ContentSectionHeader text='Comments' style={{lineHeight: '2rem', fontSize: '2rem', textAlign: 'left'}} className='mb-2' />
      <InputComment onChange={onChange} comment={comment} preview={preview} />
      {sampleComments.map(comment => ( <CommentCard comment={comment} key={comment.id} /> ))}
    </Container>
  )
}

export default TripComments