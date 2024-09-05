'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User } from '@/types';
import { cognitoSignout, getCognitoSession, refreshCognitoSession } from '@/utils/cognito';



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


  const logout = async () => {
    setUser({...defaultUser});
    await cognitoSignout();
  }

  const getCurrentDate = () => {
    let now: string | number = Date.now().toString();
    now = now.slice(0, -3);
    now = parseInt(now);
    return now;
  }

  function getDateFromSeconds(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);
    const humanReadableDate = date.toLocaleString();
    return humanReadableDate;
  }

  const getUserFromSession = (session: any) => {
    const email = session.idToken?.payload?.email;
    const groups = session.idToken?.payload['cognito:groups'];
    const isAdmin = Array.isArray(groups) ? groups.includes('admin') : false; 
    const expires = session.idToken?.payload.exp;
    const idToken = session.idToken?.toString();
    return {email, isAdmin, expires, idToken};
  }

  const getUserFromRefreshedSession = (refreshedSession: any) => { //bc why would aws ever send some data consistently or conveniently...
    const email = refreshedSession.tokens?.idToken?.payload?.email;
    const groups = refreshedSession.tokens?.idToken?.payload['cognito:groups'];
    const isAdmin = Array.isArray(groups) ? groups.includes('admin') : false;
    const expires = refreshedSession.tokens?.idToken?.payload.exp;
    const idToken = refreshedSession.tokens?.idToken?.toString();
    return {email, isAdmin, expires, idToken};
  }

  const refreshSession = async () => {
    const newSession = await refreshCognitoSession(); if (!newSession.tokens) await logout();
    const newUserData = getUserFromRefreshedSession(newSession);
    setUser({...newUserData});
  }

  const isSessionValid = (session: any) => {
    const user = getUserFromSession(session); 
    const now = getCurrentDate();
    if (user.expires < now) return false;
    return true;
  }

  const populateUser = async () => {
    setCheckingAuth(true);
    const session = await getCognitoSession();  if (!session.idToken) { await logout(); setCheckingAuth(false); return }
    if (!isSessionValid(session)) await logout()
    else await refreshSession();
    setCheckingAuth(false);
  }

  const handleRefreshInterval = (user: User) => {
    if (refreshTokenInterval.current) clearInterval(refreshTokenInterval.current);
    if (user.email) refreshTokenInterval.current = setInterval(() => { refreshSession() }, oneHour);
  }


  useEffect(() => { populateUser(); }, []); //populates user on app refresh on first load if still signed-in

  useEffect(() => { handleRefreshInterval(user); }, [user]); //refreshes token every hour

  //useEffect(() => { console.log(user); console.log(`Token expires: ${getDateFromSeconds(user.expires)}`) }, [user]); //logs user on every change


  return (
    <AuthContext.Provider value={{user, setUser, logout, getUserFromSession, checkingAuth}}>
        {children}
    </AuthContext.Provider>
  );
}



export const useAuth = () => useContext(AuthContext);