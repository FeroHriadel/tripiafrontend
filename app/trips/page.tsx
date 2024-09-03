import React from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import Container from '@/components/Container';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import TripCard from '@/components/TripCard'; 



const TripsPage = () => {
  return (
    <>
      <GradientFlexi>
        <Container className='px-10'>
          <GradientHeader text='LATEST TRIPS' className='md:translate-y-10 translate-y-7 translate-x-10 lg:-translate-x-10' />
          <GradientDescription 
            text={`Choose from the list of trips. Click a trip card to see more details. Add trips to favorites and choose the best one later.     
            Filter trips to get the most relevant results.`} 
            className='drop-shadow-lg text-center'
          />
        </Container>
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='Latest Trips' />
          <ContentSectionDescription text='Browse trips and join one you like' className='mb-20'/>
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default TripsPage