'use client'

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { TiGroup } from "react-icons/ti";
import { apiCalls } from '@/utils/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { setInvitations } from '@/redux/slices/invitationsSlice';



const fiveMinutes = 1000 * 60 * 5;



const NavbarGroupsButton = () => {
  const invitationsInt = useRef<ReturnType<typeof setInterval> | null>(null);
  const dispatch = useDispatch();
  const invitations = useSelector((state: any) => state.invitations);
  const { user, checkingAuth, logout } = useAuth();
  const { email } = user;

  async function loadInvitations() {
    if (!email) return;
    const res = await apiCalls.get(`/invitations`); 
    if (res.error) console.log('Failed to get invitations: ', res.error);
    if (JSON.stringify(res) === JSON.stringify(invitations)) return;
    dispatch(setInvitations(res));
  };

  useEffect(() => { //check for new invitations regularly
    if (email) {
      invitationsInt.current = null;
      clearInterval(invitationsInt.current!);
      invitationsInt.current = setInterval(() => { invitationsInt.current = null; loadInvitations(); }, fiveMinutes);
    } else {
      invitationsInt.current = null;
      clearInterval(invitationsInt.current!);
    }
    return () => { if (invitationsInt.current) { clearInterval(invitationsInt.current); invitationsInt.current = null; } };
  }, [invitations, email])

  if (checkingAuth || !email) return <></>

  return (
    <Link href="/profile/groups">
      <li className="flex items-center relative">
        <TiGroup className="block xs:hidden" />  {/* Icon visible on xs */}
        <span className="hidden xs:block">My Groups</span>  {/* Text visible on larger screens */}
        {
          (invitations.length > 0) 
          && 
          <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {invitations.length}
          </span>
        }
      </li>
    </Link>
  )
}

export default NavbarGroupsButton