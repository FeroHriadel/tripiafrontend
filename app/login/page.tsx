'use client'

import React, { useEffect, useState } from 'react';
import ContentSection from '@/components/ContentSection';
import Container from '@/components/Container';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import InputText from '@/components/InputText';
import ContentSectionButton from '@/components/ContentSectionButton';
import { cognitoSignin, getCognitoSession } from '@/utils/cognito';
import { useAuth } from "@/context/authContext";
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/toastContext';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import Link from 'next/link';
import { scrollToElement } from '@/utils/DOM';



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
    setLastSignedInUser(userEmail); //to prefill the form next time user signs in
    showToast(`You're now signed in`);
  }

  function redirectToProfilePage(msDelay: number) {
    setTimeout(() => {
      router.push('/profile');
    }, msDelay);
  }

  function setLastSignedInUser(email: string) {
    localStorage.setItem('lastSignedInUser', email);
  }

  function getLastSignedInUser() {
    return localStorage.getItem('lastSignedInUser') || '';
  }


  useEffect(() => { if (user?.email) redirectToProfilePage(1000); }, [user]);

  useEffect(() => { if (!user.email) setValues({...values, email: getLastSignedInUser()}); }, [] );

  useEffect(() => { scrollToElement('form-header'); }, []);


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='LOG IN' className='text-center' />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4 '>
          <ContentSectionHeader text='Ready for a Trip?' id='form-header' />
          <ContentSectionDescription text='Sign in and get going' className='mb-20' />
        </Container>
        <Container className='max-w-[500px] px-4'>
          <form onSubmit={handleSubmit} className='mb-20'>
            <InputText value={email} labelText='your email' inputName='email' onChange={handleChange} disabled={loading} className='mb-4' />
            <InputText value={password} labelText='password' type='password' inputName='password' onChange={handleChange} disabled={loading} className='mb-4' />
            <ContentSectionButton text='Sign in' type='submit' disabled={loading} />
          </form>
          <Link href='/signup'>
            <p className='text-center mb-2'>Don't have an account? <span className='underline text-textorange'>Sign up!</span></p> 
          </Link>
          <Link href='/resetpassword'>
            <p className='text-center'>Forgot your password? <span className='underline text-textorange'>Reset password</span></p>
          </Link>
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default page