'use client'

import React, { useState, useRef, useEffect } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import InputText from '@/components/InputText';
import InputTextarea from '@/components/InputTextarea';
import InputFileUpload from '@/components/InputFileUpload';
import ContentSectionButton from '@/components/ContentSectionButton';
import CenteredImage from '@/components/CenteredImage';
import { useToast } from '@/context/toastContext';
import { loadImage } from '@/utils/imageUpload';



const ProfilePage = () => {
  const [user, setUser] = useState({nickname: '', profilePicture: '', about: ''});
  const [loading, setLoading] = useState(false);
  const [imageSize, setImageSize] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();
  const { nickname, profilePicture, about } = user;


  function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const loadRes: any = await loadImage(e); 
    if (!loadRes.base64) return showToast('File failed to load')
    else { setPreview(loadRes.base64); setFileName(loadRes.fileName); } 
  }




  useEffect(() => { //resizes profile picture
    const container = contentContainerRef.current;
    if (container) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setImageSize(entry.contentRect.width);
        }
      });
      resizeObserver.observe(container);
      return () => {
        resizeObserver.unobserve(container);
      };
    }
  }, []);

  
  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='MY PROFILE' className='md:translate-y-10 translate-y-7 translate-x-10 lg:-translate-x-10' />
          <GradientDescription 
            text={`Add some info about yourself. See and manage your groups and trips`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='My Details' />
          <ContentSectionDescription text='Fill in your details' className='mb-20'/>
        </Container>
        <Container className='px-4 max-w-[500px]' id='content-container' ref={contentContainerRef} >
          <CenteredImage 
              src={preview ? preview : '/images/user.png'}
              widthOptimization={imageSize}
              heightOptimization={imageSize}
              width={imageSize} 
              height={imageSize} 
              className='mb-10 rounded-full'
            />
          <form>
            <InputText inputName='nickname' labelText='nickname' value={nickname} onChange={handleChange} disabled={loading} className='mb-4' />
            <InputTextarea inputName='about' labelText='about me' value={about} onChange={handleChange} disabled={loading} className='mb-4'/>
            <InputFileUpload text='Add Profile Picture' name='profilePicture' onChange={onImageUpload} disabled={loading} className='mb-4'/>
            <ContentSectionButton type="submit" text="Submit" disabled={loading} className='mb-4' />
          </form>
        </Container>
      </ContentSection>
    </>
  )
}

export default ProfilePage