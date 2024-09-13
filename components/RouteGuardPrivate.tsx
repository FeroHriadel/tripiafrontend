'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'



const PrivatePageRouteGuard = () => {
  const { user, checkingAuth } = useAuth();
  const { email } = user;
  const router = useRouter();


  useEffect(() => {
    if (!checkingAuth && !user.email) { router.push('/login'); };
  }, [email, checkingAuth])


  if (checkingAuth) return (
    <div className='fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-10'>
      <p>Checking auth...</p>
    </div>
  )

  if (email && !checkingAuth) return <></>
}

export default PrivatePageRouteGuard