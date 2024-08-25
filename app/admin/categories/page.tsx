import React from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import ContentSection from '@/components/ContentSection';
import Container from '@/components/Container';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';



const CategoriesPage = () => {
  return (
    <>
      <GradientFlexi>
        <GradientHeader text='CATEGORIES' />
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='Categories' />
          <ContentSectionDescription text='Create, edit and delete categories' className='mb-20' />
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default CategoriesPage