'use client'

import { useEffect } from "react";
import { apiCalls } from "@/utils/apiCalls";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCategories } from "@/redux/slices/categoriesSlice";
import { setFavoriteTrips } from "@/redux/slices/favoriteTripsSlice";
import { useAuth } from "@/context/authContext";



export const dynamic = 'force-dynamic';



const AppPreloader = () => {
  const { user } = useAuth(); const { email } = user;
  const categories = useAppSelector((state) => state.categories);
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


  useEffect(() => {preloadCategories();}, []);

  useEffect(() => {if (email) preloadFavoriteTrips()}, [email]);



  return (<></>);
};

export default AppPreloader;

