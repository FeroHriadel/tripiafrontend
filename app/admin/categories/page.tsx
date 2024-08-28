'use client'

import React, { useState } from 'react';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import ContentSection from '@/components/ContentSection';
import Container from '@/components/Container';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import Link from 'next/link';
import { TableContainer, TableHeader, TableLine } from '@/components/Table';
import { useAppSelector } from '@/redux/store';
import { FaPenFancy, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Category } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/context/toastContext';
import { removeCategory } from '@/redux/slices/categoriesSlice';
import { useAppDispatch } from '@/redux/store';



const CategoriesPage = () => {
  const categories = useAppSelector((state) => state.categories);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { showToast } = useToast();
  const dispatch = useAppDispatch();


  function handleError(text: string) {
    showToast(text);
    setCategoryToDelete(null);
  }

  function handleSuccess() {
    showToast('Category deleted');
    dispatch(removeCategory(categoryToDelete!.id));
    setCategoryToDelete(null);
  }

  async function deleteCategory() {
    closeConfirm();
    showToast('Deleteing Category...');
    const res = await apiCalls.del(`/categories/${categoryToDelete?.id}`);
    if (res.error) return handleError(res.error)
    else return handleSuccess();
  }

  function openConfirm(category: Category) {
    setCategoryToDelete(category);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
  }
  

  return (
    <>
      <GradientFlexi>
        <GradientHeader text='CATEGORIES' />
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='Categories' />
          <ContentSectionDescription text='Create, edit and delete categories' className='mb-20' />
          <TableContainer>
            <TableHeader headerText='Categories' headerContent={<Link href='/admin/categories/add'><FaPlus className='cursor-pointer' /></Link>} />
            {
              categories.map((category: Category) => (
                <TableLine key={category.id}>
                  <p>{category.name}</p>
                  <span className='flex gap-2'>
                    <Link href={`/admin/categories/edit?id=${category.id}`}><FaPenFancy className='cursor-pointer' /></Link>
                    <FaTrashAlt className='cursor-pointer' onClick={() => openConfirm(category)} />
                  </span>
                </TableLine>
              ))
            }
          </TableContainer>
        </Container>
      </ContentSection>

      <GradientFlexi />

      <ConfirmDialog open={confirmOpen} onClose={closeConfirm} onConfirm={deleteCategory} text={`Do you want to permanently delete '${categoryToDelete?.name}'?`} />
    </>
  )
}

export default CategoriesPage