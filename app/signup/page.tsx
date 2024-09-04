'use client'

import React, { useEffect, useState } from 'react';
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
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';



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
    setTimeout(() => { window.scrollBy({ top: 250, left: 0, behavior: 'smooth' }); }, 250);
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


  //other functions
  function scrollToFormHeader() {
    const element = document.getElementById('form-header');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }


  //subscriptions
  useEffect(() => {
    scrollToFormHeader();
  }, [])


  //render
  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='SIGN UP' className='md:translate-y-10 translate-y-7 translate-x-10 lg:-translate-x-10' />
          <GradientDescription 
            text={`Create an account so you can join trips and invite people to yours.`} 
            className='drop-shadow-lg text-center'
          />
          <GradientDescription 
            text={`Just confirm your email and you are in.`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container>
          <ContentSectionHeader text='Ready for a Trip?' id='form-header' />
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
              <ContentSectionButton text='Confirm' type='submit' disabled={loading} className='mb-4' />
            </form>
          }
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default SignupPage