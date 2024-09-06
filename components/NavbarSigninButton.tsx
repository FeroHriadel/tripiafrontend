'use client'

import React from 'react';
import Link from 'next/link';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/authContext';



const NavbarSigninButton = () => {
  const { user, checkingAuth, logout } = useAuth();
  const { email } = user;


  if (checkingAuth) return <></>

  if (!email) return (
    <Link href="/login">
      <li className="flex items-center">
        <FaSignInAlt className="block xs:hidden" />  {/* Icon visible on xs */}
        <span className="hidden xs:block">Log in</span>  {/* Text visible on larger screens */}
      </li>
    </Link>
  )

  return (
    <li className="flex items-center cursor-pointer" onClick={logout}>
      <FaSignOutAlt className="block xs:hidden" />  {/* Icon visible on xs */}
      <span className="hidden xs:block">Log out</span>  {/* Text visible on larger screens */}
    </li>
  )
}

export default NavbarSigninButton