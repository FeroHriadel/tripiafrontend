import React from 'react';
import { leagueSpartan } from '@/app/fonts';

interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number};
}

const GradientSubheader = ({ text, className = '', style = {} }: Props) => {
  return (
    <h2 
      className={leagueSpartan.className + ` text-3xl xs:text-4xl md:text-6xl font-bold text-white ` + className}
      style={style}
    >
      {text}
    </h2>
  )
}

export default GradientSubheader