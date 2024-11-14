import GradientFlexi from '@/components/GradientFlexi'
import React from 'react'



const NotFoundPage = () => {
  return (
    <>
      <GradientFlexi>
        <div className='w-[100%] flex flex-col justify-center items-center'>
          <h1 className='text-4xl font-bold text-center'>404</h1>
          <p className='text-2xl font-bold text-center'>Page not found</p>
        </div>
      </GradientFlexi>
    </>
  )
}

export default NotFoundPage