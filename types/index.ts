import { Interface } from "readline";

export interface Category {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
  type: '#CATEGORY'
}

export interface Trip {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  nickname?: string;
  id?: string;
  name: string;
  departureDate: string;
  departureTime: string;
  departureFrom: string;
  destination: string;
  description: string;
  category?: string;
  keyWords?: string;
  image?: string;
  requirements?: string;
  meetingLat?: number | null | undefined;
  meetingLng?: number | null | undefined;
  destinationLat?: number | null | undefined;
  destinationLng?: number | null | undefined;
}

export interface User { //auth user
  isAdmin: boolean;
  email: string;
  expires: number;
  idToken: string;
}

export interface UserProfile {
  nickname: string;
  profilePicture: string;
  about: string;
  email: string;
  groups: string[];
}

export interface Comment {
  id: string;
  by: string;
  body: string;
  image: string;
  trip: string;
  createdAt: string;
}

export interface Group {
  id: string;
  createdBy: string;
  members: string[];
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  postedBy: string;
  body: string;
  images: string[];
  groupId: string;
  createdAt: string;
}

export interface Invitation {
  id: string;
  groupId: string;
  groupName: string;
  invitedByEmail: string;
  invitedByNickname: string;
  invitedByImage?: string;
  invitee: string;
  createdAt: string;
}