'use client'

import React, { useEffect, useState } from 'react';
import InputText from './InputText';
import { UserProfile } from '@/types';
import { apiCalls } from '@/utils/apiCalls';



interface Props {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  onUserSelected: (user: UserProfile) => void;
}



const InputUsersSearch = ({ className, id, style, onUserSelected }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);


  function onChange(e: React.ChangeEvent<HTMLInputElement>) { setSearchValue(e.target.value); }

  async function getUsersByNicknameStartsWith() {
    setLoading(true);
    const users = await apiCalls.post('/users', {nicknameStartsWith: searchValue});
    if (!users.error) setSearchResults(users);
    setLoading(false);
  }

  function handleUserClick(userProfile: UserProfile) {
    onUserSelected(userProfile);
  }


  useEffect(() => { if (searchValue.length > 1) getUsersByNicknameStartsWith(); }, [searchValue]); //search users if search term >= 2 chars

  useEffect(() => { 
     
  }, [searchValue]);

  


  return (
    <section className={'w-[100%] relative ' + className} id={id} style={style}>
      {/* loader */}
      {loading && <p className='absolute right-2 top-1/2 text-sm text-black -translate-y-1/2' style={{zIndex: '1'}}>Loading...</p>}

      {/* search input */}
      <InputText labelText='search users' inputName='searchValue' value={searchValue} onChange={onChange} />

      {/* search results */}
      {
        (searchResults.length > 0 && searchValue.length > 1)
        &&
        <div 
          className='max-h-[10rem] w-[100%] absolute -top-11rem overflow-y-auto rounded flex flex-col my-4' style={{zIndex: '5'}}>
          {
            searchResults.map((userProfile) => (
              <div 
                className='w-[100%] text-xl text-darkgray bg-white hover:bg-lightgray cursor-pointer flex'
                key={userProfile.email}
                onClick={() => onUserSelected(userProfile)}
              >
                {
                  userProfile.profilePicture
                  ?
                  <div className='w-[25px] h-[25px] rounded-full mx-2 my-1' style={{background: `url(${userProfile.profilePicture}) no-repeat center center/cover`}} />
                  :
                  <div className='w-[25px] h-[25px] rounded-full mx-2 my-1' style={{background: `url(/images/user.png) no-repeat center center/cover`}} />
                }
                <p>{userProfile.nickname}</p>
              </div>
            ))
          }
        </div>
      }
    </section>
  )
}

export default InputUsersSearch