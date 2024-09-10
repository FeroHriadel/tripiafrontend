import React from 'react';



interface Props {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: {[key: string]: string | number};
}


const GradientButtonPurpleGray = ({ text = 'Add text, Dummy', type='button', className = '', style = {} }: Props) => {
  return (
    <button 
      type={type}
      className={`h-[3.5rem] w-full text-white font-semibold rounded-[1rem] border-none outline-none bg-gradient-to-r from-[#833ab4fd] to-[#d9d9d9] cursor-pointer ` + className}
      style={style}
    >
      <p className='text-xl'>
        {text}
      </p>
    </button>
  )
}

export default GradientButtonPurpleGray