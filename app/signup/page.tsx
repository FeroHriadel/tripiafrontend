'use client'

import React, { useState } from 'react';
import ContentSection from '@/components/ContentSection';
import Container from '@/components/Container';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import InputText from '@/components/InputText';
import ContentSectionButton from '@/components/ContentSectionButton';
import { useToast } from '@/context/toastContext';
import { cognitoSignup, confirmCognitoSignup, cognitoSignin } from '@/utils/cognito';
import { useRouter } from 'next/navigation';
import GradientFlexi from '@/components/GradientFlexi';



const SignupPage = () => {
  //values
  const [values, setValues] = useState({email: '', password: '', code: ''});
  const { email, password, code } = values;
  const [loading, setLoading] = useState(false);
  const [showConfirmSignupForm, setShowConfirmSignupForm] = useState(false);
  const disabled = loading || showConfirmSignupForm;
  const { showToast } = useToast();
  const router = useRouter();


  //signup functions
  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isSignupFormOk() {
    if (!isValidEmail(email)) { showToast('Invalid email address'); return false; }
    if (password.length < 6) { showToast('Password must be at least 6 characters long'); return false; }
    return true
  }

  function handleSignupFail(error: string) {
    showToast(error);
    setLoading(false);
  }

  function handleSignupSuccess() {
    setShowConfirmSignupForm(true);
    setLoading(false);
    setTimeout(() => { window.scrollBy({ top: 200, left: 0, behavior: 'smooth' }); }, 250);
  }

  async function handleSignupSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!isSignupFormOk()) return;
    setLoading(true); 
    const res = await cognitoSignup(email, password);
    if (res.error) handleSignupFail(res.error)
    else handleSignupSuccess();
  }


  //confirm signup functions
  function handleConfirmSignupFail(error: string) {
    showToast(error);
    setLoading(false);
  }

  async function handleConfirmSignupSuccess() {
    showToast('Sign up confirmed');
  }

  async function handleConfirmSignupSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);
    const res = await confirmCognitoSignup(email, code);
    if (res.error) handleConfirmSignupFail(res.error);
    else handleConfirmSignupSuccess();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }


  //render
  return (
    <>
      <GradientFlexi style={{position: 'fixed', bottom: 0, left: 0, width: '100vw'}} height='50vh' bottomWave={false} />

      <ContentSection className='mt-40 z-[2]'>
        <Container>
          <ContentSectionHeader text='Ready for a Trip?' />
          <ContentSectionDescription text='Fill in the form and get started' className='mb-20' />
        </Container>
        <Container className='max-w-[500px] px-4'>
          <form onSubmit={handleSignupSubmit} className='mb-20'>
            <InputText value={email} labelText='your email' inputName='email' onChange={handleChange} disabled={disabled} className='mb-4' />
            <InputText value={password} labelText='password' type='password' inputName='password' onChange={handleChange} disabled={disabled} className='mb-4' />
            <ContentSectionButton text='Sign up' type='submit' disabled={disabled} />
          </form>

          {
            /* signup confirmation form */
            showConfirmSignupForm 
            && 
            <form onSubmit={handleConfirmSignupSubmit} id='confirm-form'>
              <p className='text-center'>We sent you an email with a confirmation code. Please write the code below and click Confirm</p>
              <br />
              <InputText value={code} labelText='code from your email' inputName='code' onChange={handleChange} disabled={loading} className='mb-4' />
              <ContentSectionButton text='Confirm' type='submit' disabled={loading} className='mb-20' />
            </form>
          }
        </Container>
      </ContentSection>
    </>
  )
}

export default SignupPage