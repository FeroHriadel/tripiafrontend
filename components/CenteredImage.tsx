import React from 'react';
import Image from 'next/image';



interface Props {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  widthOptimization?: number;
  heightOptimization?: number;
  className?: string;
  style?: {[key: string]: string};
}


const CenteredImage = ({
  src, 
  alt = '', 
  width = 400, 
  height = 400,
  widthOptimization = 400,
  heightOptimization = 400,
  className = '', 
  style = {}
}: Props) => {


  const convertValue = (value: number | string) => {
      if (typeof value === 'number') return value + 'px';
      else if (typeof value === 'string') return value;
      else throw new Error('Invalid input: must be a number or a string');
  }


  return (
    <div 
      className={`relative flex justify-center items-center overflow-hidden rounded ` + className}
      style={{height, width, ...style /* had to pass height & width in inline styles bc tailwind `h-[${convertValue(width)}] & w-[...]` occasionally failed, use: `max-height`, `min-width`, etc... if you need to change the height from @media@query */}} 
    >
      <Image 
        src={src} 
        alt={alt}
        width={widthOptimization}
        height={heightOptimization}
        className='w-[100%] h-[100%] absolute top-[50%] left-[50%] rounded' 
        style={{objectFit: 'cover', transform: 'translate(-50%, -50%)'}} 
      />
      </div>
  )
}



export default CenteredImage