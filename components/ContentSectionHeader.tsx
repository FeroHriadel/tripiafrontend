import React from 'react';



interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number}
}



const ContentSectionHeader = ({ text, className = '', style = {} }: Props) => {
  return (
    <h2 className={`font-semibold text-3xl xs:text-4xl md:text-6xl text-center text-textorange mb-1 ` + className} style={{...style}}>{text}</h2>
  )
}

export default ContentSectionHeader