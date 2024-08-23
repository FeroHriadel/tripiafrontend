import React from 'react';
import GradientHeader from '@/components/GradientHeader';
import GradientBackground from '@/components/GradientBackground';
import GradientSubheader from '@/components/GradientSubheader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import Container from '@/components/Container';
import hillsImage from '@/public/images/hills.png';
import computerImage from '@/public/images/computer.png';
import { lato } from '@/app/fonts';
import { leagueSpartan } from '@/app/fonts';
import './page.css';



const HomePage = () => {
  return (
    <>
      <GradientBackground>
        <div className="hero-content">
          <div className="hero-text">
            <h2 className={lato.className + ` team-up-now`}>TEAM UP NOW</h2>
            <h1 className={leagueSpartan.className + ` tripia `}>Tripia</h1>
            <h4 className={leagueSpartan.className + ` description drop-shadow-lg`}>Share your journey. Invite others.</h4>
            <h4 className={leagueSpartan.className + ` description drop-shadow-lg`}>Or just browse and hop onboard.</h4>
          </div>

          <img className="computer-image" src={computerImage.src} alt="comuter image"/>

        </div>
      </GradientBackground>
    </>
  )
}

export default HomePage