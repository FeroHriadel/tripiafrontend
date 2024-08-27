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
import { apiCalls } from '@/utils/apiCalls';
import { Category } from '@/types';
import { useAppDispatch } from "@/redux/store";
import { addCategory } from "@/redux/slices/categoriesSlice";
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/toastContext';



const CategoryAddPage = () => {
  const [name, setName] = React.useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showToast } = useToast();
  

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function isFormOk() {
    if (!name) return false;
    else return true;
  }

  function addCategoryToState(category: Category) {
    dispatch(addCategory(category));
  }

  function handleError(text?: string) {
    showToast(text || 'Failed to create category');
    setLoading(false);
  }

  function handleSuccess(category: Category) {
    addCategoryToState(category);
    setName('');
    showToast('Category created')
    setLoading(false);
    router.push('/admin/categories');
  }

  async function createCategory() {
    try {
      showToast('Saving Category...');
      const body = {name}; 
      const res = await apiCalls.post('/categories', body);
      if (res.error) handleError(res.error)
      else handleSuccess(res);
    } catch (error) {
      console.log(error);
      handleError('Failed to create category');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormOk()) return;
    setLoading(true);
    await createCategory();
  }


  return (
    <>
      <GradientFlexi>
        <GradientHeader text='ADD CATEGORY' className='text-center' />
        <GradientDescription text='Create a new category for trips.' className='text-center' />
      </GradientFlexi>

      <ContentSection className='pb-60'>
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

      <GradientFlexi />
    </>
  )
}

export default CategoryAddPage