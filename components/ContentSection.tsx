import React from 'react';



interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: {[key: string]: string | number}
}

const ContentSection = ({ children, className = '', style = {} }: Props) => {

  function coverUpperGradientStickingOut() {
    return (
      <div className="absolute -top-1 left-0 w-[100%] h-[8px] bg-white" />
    )
  }

  function coverLowerGradientStickingOut() {
    return (
      <div className="absolute -bottom-1 left-0 w-[100%] h-[8px] bg-white z-10" />
    )
  }
   

  return (
    <div className={`relative w-100 min-h-[400px] pb-[1px] ` + className} style={{...style}}>
      {coverUpperGradientStickingOut()}
      {children}
      {coverLowerGradientStickingOut()}
    </div>
  )
}

export default ContentSection