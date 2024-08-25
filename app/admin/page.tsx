import ContentSection from '@/components/ContentSection';
import ContentSectionDescription from '@/components/ContentSectionDescription';
import ContentSectionHeader from '@/components/ContentSectionHeader';
import ContentSectionButton from '@/components/ContentSectionButton';
import Container from '@/components/Container';
import GradientFlexi from '@/components/GradientFlexi';
import GradientHeader from '@/components/GradientHeader';
import React from 'react';
import Link from 'next/link';



const AdminPage = () => {
  return (
    <>
      <GradientFlexi>
        <GradientHeader text='ADMIN' />
      </GradientFlexi>

      <ContentSection>
        <Container className='px-4'>
          <ContentSectionHeader text='Admin Dashboard' />
          <ContentSectionDescription text='Manage the following:' className='mb-20' />
            <Link href='/admin/categories'>
              <ContentSectionButton text='Categories' className='mb-4'/>
            </Link>

            <Link href='/admin/users'>
              <ContentSectionButton text='Users' className='mb-4' />
            </Link>

            <Link href='/admin/trips'>
              <ContentSectionButton text='Trips' className='mb-4' />
            </Link>
        </Container>
      </ContentSection>

      <GradientFlexi />
    </>
  )
}

export default AdminPage