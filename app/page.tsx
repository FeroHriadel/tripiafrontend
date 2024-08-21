import React from 'react';
import TopGradient from '@/components/GradientTop';
import GradientHeader from '@/components/GradientHeader';
import GradientSubheader from '@/components/GradientSubheader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import './page.css';
import carImage from '@/public/images/car.png';



const HomePage = () => {
  return (
    <>
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

      <ContentSection style={{paddingTop: 0}}>
        <img 
          src={carImage.src} 
          alt="car" 
          className='car-image'
        />
      </ContentSection>
    </>
  )
}

export default HomePage