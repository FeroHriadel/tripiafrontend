import React from 'react';
import './GradientButtonBig.css';



interface Props {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: {[key: string]: string | number};
}


const GradientButtonBig = ({ text = 'Add text, Dummy', type='button', className = '', style = {} }: Props) => {
  return (
    <button 
      type={type}
      className={className + ` ` + `gradient-button-big`}
      style={style}
    >
      <p className='gradient-button-big-text'>
        {text}
      </p>
    </button>
  )
}

export default GradientButtonBig