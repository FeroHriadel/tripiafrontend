import React from 'react';
import './ContentSectionButton.css';



interface Props {
  text: string;
  className?: string;
  style?: {[key: string]: string | number};
}



const ContentSectionButton = ({ text = 'addTextDummy', className = '', style = {} }: Props) => {
  return (
    <button 
      type='button'
      className={className + ` ` + `content-button`}
      style={style}
    >
      <p className='content-button-text'>
        {text}
      </p>
    </button>
  )
}

export default ContentSectionButton