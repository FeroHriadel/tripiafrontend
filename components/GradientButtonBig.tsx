import React from 'react';
import './GradientButtonBig.css';



interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number};
}


const GradientButtonBig = ({ text = 'addTextDummy', className = '', style = {} }: Props) => {
  return (
    <button 
      type='button'
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