import React from 'react';
import GradientBackground from '@/components/GradientBackground';
import GradientHeader from '@/components/GradientHeader';
import GradientSubheader from '@/components/GradientSubheader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import hillsImage from '@/public/images/hills.png';
import { leagueSpartan } from './fonts';
import './page.css';



const HomePage = () => {
  return (
    <>
      <GradientBackground>
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
      </GradientBackground>

      <ContentSection style={{zIndex: 2}}>
        <img src={hillsImage.src} alt="car" className='hills-image' />
        <div className="absolute top-0 left-0 h-[100%] w-[100%] flex flex-col justify-center items-center gap-5">
          <h2 className='text-white text-5xl xs:text-6xl md:text-8xl text-center font-semibold drop-shadow-lg'>Discover New Adventures</h2>
          <GradientSubheader 
            text='Share the journey, split the costs of gas and accommodation, while making new friends along the way' 
            className='text-center font-semibold drop-shadow-lg w-[75%]' 
          />
        </div>
      </ContentSection>

      <GradientBackground />
    </>
  )
}

export default HomePage