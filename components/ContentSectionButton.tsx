import React from 'react';
import './ContentSectionButton.css';



interface Props {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: {[key: string]: string | number};
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => any;
}



const ContentSectionButton = ({ text = 'Add text, Dummy', type = 'button', disabled = false, className = '', style = {}, children, onClick }: Props) => {
  return (
    <button 
      type={type}
      className={className + ` ` + `content-button`}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      <p className='content-button-text'>
        {text}
      </p>
      {children}
    </button>
  )
}

export default ContentSectionButton