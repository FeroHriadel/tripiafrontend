'use client'

import React from 'react';
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



const CategoriesPage = () => {
  const categories = useAppSelector((state) => state.categories);
  

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
              categories.map((category) => (
                <TableLine key={category.id}>
                  <p>{category.name}</p>
                  <span className='flex gap-2'>
                    <FaPenFancy className='cursor-pointer' />
                    <FaTrashAlt className='cursor-pointer' />
                  </span>
                </TableLine>
              ))
            }
          </TableContainer>
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default CategoriesPage