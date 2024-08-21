import React from 'react';



interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: {[key: string]: string | number}
}

const ContentSection = ({ children, className = '', style = {} }: Props) => {
  return (
    <main className={`relative w-100 m-h-[280px] ` + className} style={{...style}}>
      {children}
    </main>
  )
}

export default ContentSection