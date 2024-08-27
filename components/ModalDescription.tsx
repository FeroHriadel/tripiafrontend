import React from 'react';



interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number}
}



const ModalDescription = ({ text, className = '', style = {} }: Props) => {
  return (
    <h4 className={`font-medium text-xl xs:text-2xl text-center ` + className} style={{...style}}>{text}</h4>
  )
}

export default ModalDescription