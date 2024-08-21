import React from 'react';
import { lato } from '@/app/fonts';



interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number};
}
 
const GradientHeader = ({ text, className = '', style = {opacity: '0.4', color: 'white'} }: Props) => {
  return (
    <h1 
      className={lato.className + ` text-5xl xs:text-6xl md:text-8xl font-extrabold ` + className}
      style={{opacity: '0.4', color: 'white', ...style}}
    >
      {text.toUpperCase()}
    </h1>
  )
}

export default GradientHeader