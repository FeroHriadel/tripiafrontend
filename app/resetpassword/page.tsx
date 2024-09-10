'use client'

import React from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import InputText from '@/components/InputText';
import ContentSectionButton from '@/components/ContentSectionButton';
import { useToast } from '@/context/toastContext';
import { cognitoResetPassword, cognitoConfirmResetPassword } from '@/utils/cognito';
import Link from 'next/link';
import { scrollToElement } from '@/utils/DOM';



const ResetPasswordPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [passwordChanged, setPasswordChanged] = React.useState(false);
  const [values, setValues] = React.useState({email: '', code: '', newPassword: ''});
  const { email, code, newPassword } = values;
  const { showToast } = useToast();


  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isFormOk() {
    if (!isValidEmail(email)) { showToast('Invalid email address'); return false; }
    return true
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleSubmitError(error: string) {
    showToast(error);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!isFormOk()) return;
    setLoading(true);
    const res = await cognitoResetPassword(values.email); if (res .error) return handleSubmitError(res.error);
    setEmailSent(true); setLoading(false);
    setTimeout(() => { scrollToElement('confirm-form'); }, 250);
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await cognitoConfirmResetPassword({email: values.email, confirmationCode: values.code, newPassword: values.newPassword});
    if (res.error) return handleSubmitError(res.error);
    setPasswordChanged(true);
  }


  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='RESET PASSWORD' className='text-center' />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4 '>
          <ContentSectionHeader text='Need New Password?' id='form-header' />
          <ContentSectionDescription text='Change your password here.' className='mb-20' />
        </Container>
        <Container className='max-w-[500px] px-4'>
          <form onSubmit={handleSubmit} className='mb-10'>
            <InputText value={email} labelText='your email' inputName='email' onChange={handleChange} disabled={loading || emailSent} className='mb-4' />
            <ContentSectionButton text='Reset Password' type='submit' disabled={loading || emailSent} />
          </form>

          {
            emailSent
            &&
            <form onSubmit={changePassword} id='confirm-form'>
              <p className='text-center mb-4'>An email with a code was sent on your email. Please enter the code and your new password below:</p>
              <InputText value={code} labelText='code from your email' inputName='code' onChange={handleChange} disabled={loading} className='mb-4' />
              <InputText value={newPassword} labelText='new password' inputName='newPassword' onChange={handleChange} disabled={loading} className='mb-4' />
              <ContentSectionButton text='Save New Password' type='submit' disabled={loading} className='mb-10' />
            </form>
          }

          {
            passwordChanged
            &&
            <>
              <p className='text-center mb-2'>Your password has been changed successfully.</p>
              <Link href='/login'>
                <p className='text-center'>Click here to <span className='underline text-textorange'>log in</span></p>
              </Link>
            </>
          }
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>    
  )
}

export default ResetPasswordPage