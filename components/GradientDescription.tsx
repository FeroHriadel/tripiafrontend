import React from 'react';
import { leagueSpartan } from '@/app/fonts';

interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number};
}

const GradientDescription = ({ text, className = '', style = {} }: Props) => {
  return (
    <h3 
      className={leagueSpartan.className + ` text-2xl xs:text-3xl md:text-4xl text-white ` + className}
      style={style}
    >
      {text}
    </h3>
  )
}

export default GradientDescription