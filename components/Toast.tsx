import React from 'react';
import './Toast.css';



interface Props {
  text: string;
  isToastShown: boolean;
}



const Toast = ({ text, isToastShown }: Props) => {
  return (
    <div className={isToastShown ? 'toast shown' : 'toast'}>
      <p className='toast-text'>{text}</p>
    </div>
  )
}

export default Toast