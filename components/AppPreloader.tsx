'use client'

import { useEffect } from "react";
import { apiCalls } from "@/utils/apiCalls";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCategories } from "@/redux/slices/categoriesSlice";
import { setFavoriteTrips } from "@/redux/slices/favoriteTripsSlice";
import { setInvitations } from "@/redux/slices/invitationsSlice";
import { setProfile } from "@/redux/slices/profileSlice";
import { useAuth } from "@/context/authContext";
import { Group, UserProfile } from "@/types";



export const dynamic = 'force-dynamic';



const checkInvitesInterval = 300000; //5min



const AppPreloader = () => {
  const { user } = useAuth(); const { email } = user;
  const invitations = useAppSelector((state) => state.invitations);
  const profile = useAppSelector((state) => state.profile);
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
    else { dispatch(setProfile(res)); await removeNonexistingGroups(res.groups, res); }
  };

  async function removeNonexistingGroups(profileGroups: string[], userProfile: UserProfile) {
    /******************************************************************************************************************************
      - Because of the tons of fun dynamoDB gives you during the development process:
      - The simplest way to remove from User.groups in DB any groups that were deleted from GroupsTable is from the FE ¯\(ツ)/¯
      - That's why this is handled here and not in the BE where it belongs
      - Did I say I will never voluntarily work with DynamoDb again?
    *******************************************************************************************************************************/
    const existingGroupsIds = await getGroupsFromProfile(profileGroups); //this should only return existing groups
    if (!existingGroupsIds) return; 
    const nonexistingGroupsIds = getNonexistingGroups(profileGroups, existingGroupsIds);
    if (nonexistingGroupsIds.length > 0) await updateProfileGroups(existingGroupsIds, userProfile);
  }

  async function getGroupsFromProfile(groupIds: string[]) {
    if (groupIds.length === 0) return;
    const res = await apiCalls.post('/groupsbatchget', {ids: groupIds}); //this should only return existing groups
    if (res.error) { console.log('Could not batchgetgroups deleted groups to remove them from user profile: ', res.error); return null };
    return (res as Group[]).map(group => group.id);
  }

  function getNonexistingGroups(profileGroups: string[], existingGroups: string[]): string[] {
    return profileGroups.filter(group => !existingGroups.includes(group));
  }
  
  async function updateProfileGroups(existingGroupIds: string[], userProfile: UserProfile) {
    const body: UserProfile = {...userProfile, groups: existingGroupIds};
    const res = await apiCalls.put('/users', body);
    if (res.error) return console.log('Failed to remove nonexisting groups from user profile', res.error);
    dispatch(setProfile(res));
  }


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

