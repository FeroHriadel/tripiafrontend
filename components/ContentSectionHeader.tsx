import React from 'react';



interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number}
  id?: string;
}



const ContentSectionHeader = ({ text, className = '', id, style = {} }: Props) => {
  return (
    <h2 
      className={`font-semibold text-3xl xs:text-4xl md:text-6xl text-center text-textorange mb-1 ` + className} 
      style={{...style}}
      id={id}
    >
      {text}
    </h2>
  )
}

export default ContentSectionHeader