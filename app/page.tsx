import React from 'react';
import GradientHeader from '@/components/GradientHeader';
import GradientBackground from '@/components/GradientBackground';
import GradientSubheader from '@/components/GradientSubheader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import hillsImage from '@/public/images/hills.png';
import computerImage from '@/public/images/computer.png';
import { leagueSpartan, lato } from './fonts';
import './page.css';



const HomePage = () => {
  return (
    <>
      <GradientBackground>
        <div className='hero-content-wrapper'>
          <div className="hero-text">
            <GradientHeader text="TEAM UP NOW" />
            <GradientSubheader className='tripia' text='tripia' />
            <GradientDescription text='Share the journey. Invite others.' />
            <GradientDescription text='Or just browse an hop onboard.' />
          </div>

          <img className='hero-image' src={computerImage.src} alt="computer image" />
        </div>
      </GradientBackground>

      <ContentSection style={{zIndex: 2}}>
        <img className='hills-image' src={hillsImage.src} alt="car" />
        <div className="absolute top-0 left-0 h-[100%] w-[100%] flex flex-col justify-center items-center gap-5">
          <h2 className='text-white text-5xl xs:text-6xl md:text-8xl text-center font-semibold drop-shadow-lg'>Discover New Adventures</h2>
          <GradientSubheader 
            text='Share the journey. Split the costs of gas and accommodation while making new friends along the way' 
            className='text-center font-semibold drop-shadow-lg w-[75%]' 
          />
        </div>
      </ContentSection>

      <GradientBackground />
    </>
  )
}

export default HomePage