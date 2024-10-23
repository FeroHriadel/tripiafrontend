'use client'

import { useEffect } from "react";
import { apiCalls } from "@/utils/apiCalls";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCategories } from "@/redux/slices/categoriesSlice";
import { setFavoriteTrips } from "@/redux/slices/favoriteTripsSlice";
import { setInvitations } from "@/redux/slices/invitationsSlice";
import { setProfile } from "@/redux/slices/profileSlice";
import { useAuth } from "@/context/authContext";



export const dynamic = 'force-dynamic';


const checkInvitesInterval = 300000; //5min



const AppPreloader = () => {
  const { user } = useAuth(); const { email } = user;
  const invitations = useAppSelector((state) => state.invitations);
  const dispatch = useAppDispatch();
  

  async function preloadCategories() {
    const res = await apiCalls.get('/categories'); if (res.error) return console.log(res.error)
    dispatch(setCategories(res));
  };

  async function preloadFavoriteTrips() {
    if (!email) return;
    const res = await apiCalls.get(`/favoritetrips?email=${encodeURIComponent(email)}`); if (res.error) return console.log(res.error);
    dispatch(setFavoriteTrips(res.tripIds));
  };

  async function preloadInvitations() {
    if (!email) return;
    const res = await apiCalls.get(`/invitations`); 
    if (res.error) return console.log(res.error);
    if (JSON.stringify(res) === JSON.stringify(invitations)) return;
    dispatch(setInvitations(res));
  };

  async function preloadProfile() {
    const res = await apiCalls.post('/users', {email: user.email});
    if (res.error) return console.log(res.error);
    else dispatch(setProfile(res));
  };


  useEffect(() => {preloadCategories();}, []); //get categories

  useEffect(() => {if (email) preloadFavoriteTrips()}, [email]); //get favorite trips

  useEffect(() => { //get invitations periodically
    if (email) preloadInvitations();
    const interval = setInterval(() => {
      if (email) preloadInvitations();
    }, checkInvitesInterval);
    return () => clearInterval(interval);
  }, [email, invitations]);

  useEffect(() => {if (user.email) preloadProfile();}, [user]); //get user's profile



  return (<></>);
};

export default AppPreloader;

