import React from 'react';
import GradientHeader from '@/components/GradientHeader';
import GradientBackground from '@/components/GradientBackground';
import GradientSubheader from '@/components/GradientSubheader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import Container from '@/components/Container';
import hillsImage from '@/public/images/hills.png';
import computerImage from '@/public/images/computer.png';
import './page.css';



const HomePage = () => {
  return (
    <>
      <GradientBackground>
        <div className='hero-content-wrapper'>
          <div className="hero-text" >
            <GradientHeader text="TEAM UP NOW" className='' />
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

      <GradientBackground>
        <Container className='px-10'>
          <GradientHeader text='TRIPIA' className='md:translate-y-10 translate-y-5 translate-x-0 lg:-translate-x-10' />
          <GradientDescription 
            text={`Welcome to Tripia, the perfect platform for car trips and hikes! Whether you're planning a road trip or a weekend hike, you can invite others to join or find a trip to hop on. Share the journey, split the costs of gas, accommodation, and more, while making new friends along the way. Say goodbye to solo trips and enjoy the company of like-minded adventurers.`}
            className='drop-shadow-lg'
          />
        </Container>
      </GradientBackground>
    </>
  )
}

export default HomePage