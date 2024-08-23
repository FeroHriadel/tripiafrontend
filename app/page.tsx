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
import './HomePageHero.css';
import './HomePagePromo.css';



const HomePage = () => {
  return (
    <>
      <GradientBackground>
        <main className="hero-content">
          <section className="hero-text">
            <h2 className={lato.className + ` team-up-now`}>TEAM UP NOW</h2>
            <h1 className={leagueSpartan.className + ` tripia `}>Tripia</h1>
            <h4 className={leagueSpartan.className + ` description drop-shadow-lg`}>Share your journey. Invite others.</h4>
            <h4 className={leagueSpartan.className + ` description drop-shadow-lg`}>Or just browse and hop onboard.</h4>
          </section>
          <img className="computer-image" src={computerImage.src} alt="comuter image"/>
        </main>       
      </GradientBackground>

      <ContentSection style={{zIndex: 2}}>
          <img className='hills-image' src={hillsImage.src} alt="hills image" />
          <aside className='promo-text-wrapper'>
            <h3 className='discover-new-adventures text-6xl text-center font-semibold drop-shadow-lg'>Discover New Adventures</h3>
            <h4 className='promo-description text-center drop-shadow-lg'>
              Share the journey. Split the costs of gas and accommodation while making new friends along the way
            </h4>
          </aside>
      </ContentSection>

      <GradientBackground>

      </GradientBackground>
    </>
  )
}

export default HomePage