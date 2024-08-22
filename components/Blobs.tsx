import React from 'react';
import './Blobs.css';



interface BlobProps {
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}







export const Blob1 = ({color = "#F0F0F0", style={}, className = ''}: BlobProps) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={`blob blob1 ${className}`}
      style={{...style}}
    >
      <path fill={color} d="M43.6,-17.1C49,2.6,40.8,23.7,22.2,39.3C3.6,54.9,-25.4,64.9,-40.9,54.2C-56.3,43.5,-58.2,12,-49.1,-12.6C-40,-37.3,-20,-55,-0.5,-54.9C19.1,-54.7,38.1,-36.7,43.6,-17.1Z" transform="translate(100 100)" />
    </svg>
      )
}

export const Blob2 = ({color = "#F0F0F0", style={}, className = ''}: BlobProps) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={`blob blob2 ${className}`}
      style={{...style}}
    >
      <path fill={color} d="M36.4,-2.1C45.5,15.9,49.8,45.3,40.3,51.1C30.8,57,7.5,39.4,-13.5,23C-34.5,6.7,-53.1,-8.3,-50.5,-17.6C-47.9,-26.9,-23.9,-30.4,-5.1,-28.7C13.7,-27.1,27.4,-20.2,36.4,-2.1Z" transform="translate(100 100)" />
    </svg>
      )
}

export const Blob3 = ({color = "#F0F0F0", style={}, className = ''}: BlobProps) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={`blob blob3 ${className}`}
      style={{...style}}
    >
      <path fill={color} d="M43.2,-37.8C55.1,-31.3,63.3,-15.7,57,-6.3C50.8,3.1,30,6.2,18.1,19.9C6.2,33.6,3.1,58,-7.3,65.2C-17.6,72.5,-35.3,62.7,-49.3,49C-63.4,35.3,-73.8,17.6,-73.2,0.6C-72.6,-16.4,-61,-32.9,-46.9,-39.3C-32.9,-45.8,-16.4,-42.3,-0.4,-41.9C15.7,-41.5,31.3,-44.2,43.2,-37.8Z" transform="translate(100 100)" />
    </svg>
      )
}

export const Blob4 = ({color = "#F0F0F0", style={}, className = ''}: BlobProps) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={`blob blob4 ${className}`}
      style={{...style}}
    >
      <path fill={color} d="M46.8,-48.6C58.6,-45.8,64.9,-29.2,61.3,-15.8C57.8,-2.3,44.5,7.9,36.1,19.3C27.7,30.8,24.1,43.5,15.1,50.7C6.2,57.9,-8,59.5,-24.5,57.7C-41,55.9,-59.6,50.5,-60,39.6C-60.4,28.7,-42.5,12.2,-36.7,-4C-30.9,-20.1,-37.2,-35.9,-33,-40C-28.9,-44.1,-14.5,-36.4,1.5,-38.2C17.5,-40,35,-51.3,46.8,-48.6Z" transform="translate(100 100)" />
    </svg>
      )
}

export const Blob5 = ({color = "#F0F0F0", style={}, className = ''}: BlobProps) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={`blob blob5 ${className}`}
      style={{...style}}
    >
      <path fill="#F0F0F0" d="M23.2,-14.5C39.3,-7.1,67.9,-3.6,72.7,4.7C77.4,13,58.2,26.1,42.2,37.6C26.1,49.1,13,59.2,2.1,57.1C-8.9,55,-17.7,40.8,-25.2,29.3C-32.6,17.7,-38.7,8.9,-38.2,0.5C-37.7,-7.9,-30.7,-15.8,-23.2,-23.2C-15.8,-30.6,-7.9,-37.6,-2.2,-35.5C3.6,-33.3,7.1,-22,23.2,-14.5Z" transform="translate(100 100)" />
    </svg>
      )
}

export const BlobArea = () => {
  return (
    <div className='blob-area'>
      <Blob1 />
      <Blob2 style={{opacity: 0.15}} />
      <Blob3 style={{opacity: 0.2}} />
      <Blob4 />
      <Blob5 style={{opacity: 0.15}} />
    </div>
  )
}