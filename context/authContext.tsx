'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, UserProfile } from '@/types';
import { cognitoSignout, getCognitoSession, refreshCognitoSession, getUserFromSession, getUserFromRefreshedSession } from '@/utils/cognito';
import { useAppDispatch } from '@/redux/store';
import { setProfile } from '@/redux/slices/profileSlice';
import { setFavoriteTrips } from '@/redux/slices/favoriteTripsSlice';
import { setInvitations } from '@/redux/slices/invitationsSlice';



export const dynamic = 'force-dynamic';



interface AuthContextState {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  getUserFromSession: (session: any) => User;
  checkingAuth: boolean;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const defaultUser: User = {email: '', expires: 0, isAdmin: false, idToken: ''};
const defaultProfile: UserProfile = {email: '', profilePicture: '', groups: [], nickname: '', about: ''};
const oneHour = 1000 * 60 * 60;



const AuthContext = createContext<AuthContextState>({
    user: {...defaultUser},
    setUser: (user: User) => {},
    logout: () => {},
    getUserFromSession: (session: any) => ({...defaultUser}),
    checkingAuth: true
});



export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User>({...defaultUser});
  const [checkingAuth, setCheckingAuth] = useState(true);
  const refreshTokenInterval = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();


  const logout = async () => {
    setUser({...defaultUser});
    await cognitoSignout();
    dispatch(setProfile(defaultProfile));
    dispatch(setFavoriteTrips([]));
    dispatch(setInvitations([]));
  }

  const refreshSession = async () => {
    const newSession = await refreshCognitoSession(); if (!newSession.tokens) await logout();
    const newUserData = getUserFromRefreshedSession(newSession);
    setUser({...newUserData});
    setCheckingAuth(false);
  }

  const populateUser = async () => {
    setCheckingAuth(true);
    const session = await getCognitoSession();
    if (!session.idToken) { await logout(); setCheckingAuth(false); }
    else {
      if (session.idToken.payload.exp! * 1000 < Date.now()) await refreshSession()
      else { const userData = getUserFromSession(session); setUser(userData); setCheckingAuth(false); }
    }
  };


  useEffect(() => { populateUser(); }, []); //populates user on app refresh on first load if still signed-in

  //useEffect(() => { console.log(user); }, [user]); //logs user on every change


  return (
    <AuthContext.Provider value={{user, setUser, logout, getUserFromSession, checkingAuth}}>
        {children}
    </AuthContext.Provider>
  );
}



export const useAuth = () => useContext(AuthContext);