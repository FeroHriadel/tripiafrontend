import React from 'react';



interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number}
}



const ContentSectionDescription = ({ text, className = '', style = {} }: Props) => {
  return (
    <h4 className={`font-semibold text-xl xs:text-2xl md:text-3xl text-center ` + className} style={{...style}}>{text}</h4>
  )
}

export default ContentSectionDescription