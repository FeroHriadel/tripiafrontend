import React from 'react';
import './TopGradient.css';



interface Props {
  children?: React.ReactNode;
  height?: string;
  minHeight?: string;
  className?: string;
  style?: {[key: string]: string};
}



const TopGradient = ({children, height = '95vh', minHeight = '280px', className = '', style = {}}: Props) => {
  return (
    <section 
      className={`relative gradient w-[100%] flex justify-center items-center ` + className}
      style={{height: height, minHeight: minHeight, ...style}}
    >
      {/* top wave */}
      <div className="top-wave custom-shape-divider-top-1724221658">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
          </svg>
      </div>

      {/* content */}
      <div className='content-container'>
        {children}
      </div>

      {/* bottom wave */}
      <div className="custom-shape-divider-bottom-1724222867">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
    </div>

    </section>
  )
}

export default TopGradient