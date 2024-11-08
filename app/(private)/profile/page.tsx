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
import { useAuth } from '@/context/authContext';
import { apiCalls } from '@/utils/apiCalls';
import { loadImage, uploadImage, resizeImage } from '@/utils/imageUpload';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setProfile } from '@/redux/slices/profileSlice';
import Link from 'next/link';
import { UserProfile } from '@/types';



export const dynamic = 'force-dynamic';



const profilePictureMaxSize = 300;



const ProfilePage = () => {
  const [values, setValues] = useState<UserProfile>({nickname: '', profilePicture: '', about: '', email: '', groups: []});
  const { nickname, profilePicture, about, email, groups } = values;
  const [loading, setLoading] = useState(true);
  const [imageSize, setImageSize] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.profile);

  
  function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    ////without resizing:
    // const loadRes: any = await loadImage(e); 
    // if (!loadRes.base64) return showToast('File failed to load');
    // else { setPreview(loadRes.base64); setFileName(loadRes.fileName); } 
    ////with resizing:
      const file = e.target.files![0];
      if (!file) return;
      const resizedImage = await resizeImage(file, profilePictureMaxSize);
      if (resizedImage.error) return showToast(resizedImage.error);
      else { setPreview(resizedImage.base64); setFileName(file.name) };
  }

  async function fetchUser() {
    if (profile.email) { setValues({...profile}); setLoading(false); return };
    setLoading(true);
    const res = await apiCalls.post('/users', {email: user.email});
    if (res.error) { showToast('Failed to get your data.'); return setLoading(false); }
    setValues({...res});
    setLoading(false);
  }

  async function saveUserData(imageUrl?: string) {
    setValues({...values, profilePicture: imageUrl || ''});
    const body = {email, nickname, about, profilePicture: imageUrl || '', groups};
    const res = await apiCalls.put('/users', body);
    return res;
  }

  function isFormOk() {
    if (!nickname || nickname.length < 2) { showToast('Nickname must be at least 2 characters long.'); return false; }
    return true;
  }

  function handleSaveError(error: string) {
    showToast(error);
    setLoading(false);
  }

  function handleSaveSuccess(newProfile: UserProfile) {
    dispatch(setProfile(newProfile));
    showToast('Your data has been saved');
    setPreview(null);
    setFileName(null);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    if (!isFormOk()) return;
    setLoading(true);
    showToast('Saving your data...');
    let saveRes: any;
    if (preview && fileName) {
      const uploadedImg = await uploadImage(fileName, preview, user.idToken); if (!uploadedImg.imageUrl) return handleSaveError(uploadedImg.error);
      saveRes = await saveUserData(uploadedImg.imageUrl); if (saveRes.err) return handleSaveError('Saving your data failed');
    } else {
      saveRes = await saveUserData(); if (saveRes.err) return handleSaveError('Saving your data failed');
    }
    handleSaveSuccess(saveRes);
  }


  useEffect(() => { //populates user info
    if (user.email) fetchUser();
  }, [user.email]);

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
  }, [contentContainerRef.current, preview, profilePicture]);

  
  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='MY PROFILE' className='text-center mb-4' />
          <GradientDescription 
            text={`Add some info about yourself. See and manage your groups and trips`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        {
          !email
          &&
          <Container className='px-4'>
            <p className='text-center'>Fetching your data...</p>
          </Container>
        }
        {
          email
          &&
          <>
            <Container className='px-4'>
              <ContentSectionHeader text='My Details' />
              <ContentSectionDescription text='Fill in your details' className='mb-20'/>
            </Container>
            <Container className='px-4 max-w-[500px]' id='content-container' ref={contentContainerRef} >
              {
                /* user has a profile picture and has not loaded a new pic yet */
                (!preview && profilePicture)
                ?
                <CenteredImage 
                  src={profilePicture}
                  widthOptimization={imageSize}
                  heightOptimization={imageSize}
                  width={imageSize} 
                  height={imageSize} 
                  className='mb-10 rounded-full shadow-xl'
                />
                :
                /* user doesn't have a profile picture and either a)loaded one (shows preview); or b) hasn't loaded one (shows default) */
                <CenteredImage 
                  src={preview ? preview : '/images/user.png'}
                  widthOptimization={imageSize}
                  heightOptimization={imageSize}
                  width={imageSize} 
                  height={imageSize} 
                  className='mb-10 rounded-full shadow-xl'
                />
              }
              <form onSubmit={handleSubmit} className='mb-10'>
                <InputText inputName='nickname' labelText='nickname' value={nickname} onChange={handleChange} disabled={loading} className='mb-4' />
                <InputTextarea inputName='about' labelText='about me' value={about} onChange={handleChange} disabled={loading} className='mb-4'/>
                <InputFileUpload text='New Profile Picture' name='profilePicture' onChange={onImageUpload} disabled={loading} className='mb-4'/>
                <ContentSectionButton type="submit" text="Submit" disabled={loading} className='mb-4' />
              </form>

              <Link href='/profile/trips'>
                <ContentSectionButton text="My Trips" className='mb-4' />
              </Link>

              <Link href='/profile/groups'>
                <ContentSectionButton text="My Groups" className='mb-4' />
              </Link>

              <Link href='/profile/favorites'>
                <ContentSectionButton text="My Favorites" className='mb-4' />
              </Link>

              <ContentSectionButton text="Log out" onClick={logout}  className='mb-4' />
            </Container>
          </>
        }
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default ProfilePage