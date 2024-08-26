import React from 'react';
import './ContentSectionButton.css';



interface Props {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: {[key: string]: string | number};
  disabled?: boolean;
}



const ContentSectionButton = ({ text = 'Add text, Dummy', type = 'button', disabled = false, className = '', style = {} }: Props) => {
  return (
    <button 
      type={type}
      className={className + ` ` + `content-button`}
      style={style}
      disabled={disabled}
    >
      <p className='content-button-text'>
        {text}
      </p>
    </button>
  )
}

export default ContentSectionButton