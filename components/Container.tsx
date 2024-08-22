import React from 'react';



interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}


const Container = ({ children, className = '', style = {}}: Props) => {
  return (
    <div className={`mx-auto w-[100%] max-w-[1000px] ` + className} style={style}>
      {children}
    </div>
  )
}

export default Container