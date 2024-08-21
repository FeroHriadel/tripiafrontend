import React from 'react';
import TopGradient from '@/components/TopGradient';
import GradientHeader from '@/components/GradientHeader';
import GradientSubheader from '@/components/GradientSubheader';
import GradientDescription from '@/components/GradientDescription';
import Image from 'next/image';
import computerImg from '/public/images/computer.png';
import './page.css';



const HomePage = () => {
  return (
    <TopGradient>
      <div className='w-100'>
        <div className='home-page-text'>
          <GradientHeader text='Team Up Now' className='sm-whitespace-nowrap'/>
          <GradientSubheader text='Tripia' className='subheader' />
          <GradientDescription text='Share your journey. Invite others.' />
          <GradientDescription text=' Or just browse and hop onboard.' />
        </div>

        <div 
          className='computer-image'
          style={{background: `url(/images/computer.png) no-repeat center center/cover`}}
        />
      </div>
    </TopGradient>
  )
}

export default HomePage