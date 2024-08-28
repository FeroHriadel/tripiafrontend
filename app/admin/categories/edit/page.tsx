'use client'

import React, { useEffect, useState } from 'react';
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
import { replaceCategory } from "@/redux/slices/categoriesSlice";
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/toastContext';



const CategoryEditPage = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const categoryId = params.get('id');
  
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  async function prefillInput() {
    setLoading(true);
    const res = await apiCalls.get(`/categories?id=${categoryId}`);
    if (!res.id) { 
      showToast('Category not found. Redirecting...'); 
      setTimeout(() => {router.push('/admin/categories')}, 1000); 
    } else {
      setName(res.name);
      setLoading(false);
    }
  }

  function isFormOk() {
    if (!name) return false;
    else return true;
  }

  function editCategoryInState(category: Category) {
    dispatch(replaceCategory(category));
  }

  function handleError(text?: string) {
    showToast(text || 'Failed to save category');
    setLoading(false);
  }

  function handleSuccess(category: Category) {
    editCategoryInState(category);
    setName('');
    showToast('Category saved')
    setLoading(false);
    router.push('/admin/categories');
  }

  async function updateCategory() {
    try {
      showToast('Saving Category...');
      const body = {name}; 
      const res = await apiCalls.put(`/categories/${categoryId}`, body);
      if (res.error) handleError(res.error)
      else handleSuccess(res);
    } catch (error) {
      console.log(error);
      handleError('Failed to save category');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormOk()) return;
    setLoading(true);
    await updateCategory();
  }


  useEffect(() => {
    prefillInput();
  }, [])


  return (
    <>
      <GradientFlexi>
        <GradientHeader text='EDIT CATEGORY' className='text-center' />
        <GradientDescription text={`Change category's name`} className='text-center' />
      </GradientFlexi>

      <ContentSection className='pb-60'>
        <Container className='px-4 max-w-[500px]'>
          <ContentSectionHeader text='Edit Category' />
          <ContentSectionDescription text='Rename an existing category' className='mb-20' />
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
              text='Edit Category' 
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

export default CategoryEditPage