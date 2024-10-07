'use client'

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { TiGroup } from "react-icons/ti";



const NavbarGroupsButton = () => {
  const { user, checkingAuth, logout } = useAuth();
  const { email } = user;

  if (checkingAuth || !email) return <></>

  return (
    <Link href="/profile/groups">
      <li className="flex items-center">
        <TiGroup className="block xs:hidden" />  {/* Icon visible on xs */}
        <span className="hidden xs:block">My Groups</span>  {/* Text visible on larger screens */}
      </li>
    </Link>
  )
}

export default NavbarGroupsButton