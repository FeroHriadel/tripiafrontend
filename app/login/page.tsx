'use client'

import React, { useEffect, useState } from 'react';
import ContentSection from '@/components/ContentSection';
import Container from '@/components/Container';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import InputText from '@/components/InputText';
import ContentSectionButton from '@/components/ContentSectionButton';
import { cognitoSignup, confirmCognitoSignup, cognitoSignin, getCognitoSession } from '@/utils/cognito';
import { useAuth } from "@/context/authContext";
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/toastContext';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';



const page = () => {
  const [values, setValues] = useState({email: '', password: ''});
  const { email, password } = values;
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user, setUser, getUserFromSession } = useAuth();
  const router = useRouter();


  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isFormOk() {
    if (!isValidEmail(email)) { showToast('Invalid email address'); return false; }
    return true
  }

  const handleSigninError = (error: string) => {
    showToast(error);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!isFormOk()) return;
    setLoading(true);
    const res = await cognitoSignin(email.toLowerCase(), password); if (res.error) return handleSigninError('Failed to log in');
    const session = await getCognitoSession(); if (session.error) return handleSigninError(res.error);
    const { isAdmin, email: userEmail, expires, idToken } = getUserFromSession(session);
    setUser({isAdmin, email: userEmail, expires: expires, idToken: idToken});
    showToast(`You're now signed in`);
  }

  const redirectToProfilePage = (msDelay: number) => {
    setTimeout(() => {
      router.push('/profile');
    }, msDelay);
  }


  useEffect(() => { if (user?.email) redirectToProfilePage(1000); }, [user]);


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='LOG IN' className='md:translate-y-10 translate-y-7 translate-x-10 lg:-translate-x-10' />
          <GradientDescription 
            text={`Log in to your account so you can join trips and invite people to yours.`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container>
          <ContentSectionHeader text='Ready for a Trip?' id='form-header' />
          <ContentSectionDescription text='Sign in and get going' className='mb-20' />
        </Container>
        <Container className='max-w-[500px] px-4'>
          <form onSubmit={handleSubmit} className='mb-20'>
            <InputText value={email} labelText='your email' inputName='email' onChange={handleChange} disabled={loading} className='mb-4' />
            <InputText value={password} labelText='password' type='password' inputName='password' onChange={handleChange} disabled={loading} className='mb-4' />
            <ContentSectionButton text='Sign in' type='submit' disabled={loading} />
          </form>
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default page