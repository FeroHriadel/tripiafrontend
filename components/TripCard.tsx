import React from 'react'
import CenteredImage from './CenteredImage';
import { FaPenFancy, FaTrashAlt, FaRegStar } from 'react-icons/fa';
import Tag from './Tag';
import ContentSectionButton from './ContentSectionButton';
import { Trip } from '@/types';



interface Props {
  trip: Trip;
  className?: string;
  style?: {[key: string]: string | number};
}



const TripCard = ({ trip, className = '', style = {} }: Props) => {
  return (
    <div 
      className={`---card-container--- w-[100%] bg-gradient-to-l from-gray-200 to-white px-4 py-4 font-xl sm:text-xl text-base rounded-2xl ` + className}
      style={{...style}}
    >

      {/* user's image, trip name, category & icons */}
      <div className='---image-name-and-icons-container--- flex justify-between mb-4'>
        <div className="---left-image-and-text--- flex">
          <CenteredImage 
            src='/images/user.png'
            widthOptimization={100}
            heightOptimization={100}
            width={100} 
            height={100} 
            className='rounded-full max-w-[50px] max-h-[50px] sm:max-w-[100px] sm:max-h-[100px] mr-4'
          />
          <div className='---name-and-category---'>
            <p className='font-semibold'>{trip.name}</p>
            {trip.category && <small>{trip.category}</small>}
          </div>
        </div>
        <div className="---right-icons-container--- flex flex-col sm:flex-row gap-4 sm:gap-2">
          <p className='cursor-pointer'><FaTrashAlt /></p>
          <p className='cursor-pointer'><FaPenFancy /></p>
          <p className='cursor-pointer' style={{color: '#F48957'}}><FaRegStar /></p>
        </div>
      </div>

      {/* description */}
      <div className="---description-container--- mb-4">
        <p>{trip.description}</p>
      </div>

      {/* image */}
      {
        trip.image
        &&
        <div className="---image-container--- mb-4">
          <CenteredImage 
            src='/images/user.png'
            width={'100%'} 
            height={500} 
            className='rounded-2xl mr-4 max-h-[300px] xs:max-h-[500px]'
          />
        </div>
      }

      {/* keyWords (tags) */}
      {
        trip.keyWords && trip.keyWords.length >= 1
        &&
        <div className="---key-words--- flex gap-2 mb-4">
          {
            trip.keyWords.map((keyWord, idx) => (
              <Tag text={keyWord} key={keyWord + idx} />
            ))
          }
        </div>

      }
      <ContentSectionButton text='View Details' />
    </div>
  )
}

export default TripCard