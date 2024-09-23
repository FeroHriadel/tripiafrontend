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

export interface User {
  isAdmin: boolean;
  email: string;
  expires: number;
  idToken: string;
}