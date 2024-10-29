import React from 'react'
import { leagueSpartan } from '@/app/fonts'


const Tag = ({ text = 'You forgot text, dummy' }: {text: string}) => {
  return (
    <div className='bg-gradient-to-r from-[#F48957] to-[#833AB4] px-2 rounded-xl flex justify-center items-center'>
      <p className={leagueSpartan.className + ' ' + 'text-lg text-white'}>
        {text}
      </p>
    </div>
  )
}

export default Tag