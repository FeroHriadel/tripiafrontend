'use client'

import React from 'react';
import Link from 'next/link';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/authContext';
import { CgProfile } from "react-icons/cg";



const NavbarProfileButton = () => {
  const { user, checkingAuth, logout } = useAuth();
  const { email } = user;

  if (checkingAuth || !email) return <></>

  return (
    <Link href="/profile">
      <li className="flex items-center">
        <CgProfile className="block xs:hidden" />  {/* Icon visible on xs */}
        <span className="hidden xs:block">My Profile</span>  {/* Text visible on larger screens */}
      </li>
    </Link>
  )
}

export default NavbarProfileButton