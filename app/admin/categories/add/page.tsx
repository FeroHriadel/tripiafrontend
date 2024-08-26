'use client'

import React, { useState } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import GradientDescription from '@/components/GradientDescription';
import Container from '@/components/Container';
import ContentSection from '@/components/ContentSection';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import InputText from '@/components/InputText';
import ContentSectionButton from '@/components/ContentSectionButton';



const CategoryAddPage = () => {
  const [name, setName] = React.useState('');
  const [loading, setLoading] = useState(false);
  

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }


  return (
    <>
      <GradientFlexi>
        <GradientHeader text='ADD CATEGORY' className='text-center' />
        <GradientDescription text='Create a new category for trips.' className='text-center' />
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4 max-w-[500px]'>
          <ContentSectionHeader text='Add Category' />
          <ContentSectionDescription text='Create a new Category' className='mb-20' />
          <form onSubmit={handleSubmit}>
            <InputText 
              labelText='name' 
              inputName='categoryName' 
              onChange={handleChange} 
              value={name} 
              className='mb-4'
              disabled={loading}
            />
            <ContentSectionButton 
              text='Add Category' 
              type='submit' 
              disabled={loading} 
            />
          </form>
        </Container>
      </ContentSection>
    </>
  )
}

export default CategoryAddPage