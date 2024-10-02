'use client'

import React from 'react';
import Container from '@/components/Container';
import ContentSectionHeader from '../components/ContentSectionHeader';
import InputComment from './InputComment';
import { Trip } from '@/types';




interface Props {
  trip: Trip;
}



const TripComments = ({ trip }: Props) => {
  const [comment, setComment] = React.useState('');
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
    </Container>
  )
}

export default TripComments