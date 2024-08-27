import React from 'react';
import './ButtonOrange.css';



interface Props {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: {[key: string]: string | number};
  disabled?: boolean;
  onClick?: (param?: any) => void;
}



const ButtonOrange = ({ text = 'Add text, Dummy', type = 'button', disabled = false, onClick, className = '', style = {} }: Props) => {
  return (
    <button 
      type={type}
      className={`orange-button w-[100%] h-[3.5rem]` + ` ` + className}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      <p className='orange-button-text'>
        {text}
      </p>
    </button>
  )
}

export default ButtonOrange