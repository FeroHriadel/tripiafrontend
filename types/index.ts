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
  id?: string;
  name: string;
  departureDate: string;
  departureTime: string;
  departureFrom: string;
  destination: string;
  description: string;
  category?: string;
  keyWords?: string[];
  image: string;
  requirements: string;  
  type: '#TRIP'
}

export interface User {
  isAdmin: boolean;
  email: string;
  expires: number;
  idToken: string;
}