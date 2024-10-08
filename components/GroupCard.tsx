import React, { useState, useEffect } from 'react';
import { Group, UserProfile } from '@/types';
import { apiCalls } from '@/utils/apiCalls';
import CenteredImage from './CenteredImage';
import { useAuth } from '@/context/authContext';
import { FaTrashAlt, FaPenAlt } from 'react-icons/fa';



interface Props {
  group: Group;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}



const GroupCard = ({ className, style, id, group }: Props) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { user } = useAuth();


  function joinUserNamesWithCommas() {
    const userNames = [...users].map(u => u.nickname);
    return userNames;
  }
  
  async function getUserNames() {
    const body = {emails: group.members}
    const res = await apiCalls.post('/usersbatchget', body);
    if (res.error) return;
    setUsers(res);
  }

  function getOwnerImg() {
    const owner = users.find(u => u.email === group.createdBy);
    const img = owner?.profilePicture;
    return img || '/images/user.png';
  }

  function isOwner() { console.log(group.createdBy === user?.email); return group.createdBy === user?.email; }


  useEffect(() => { getUserNames(); }, [])


  return (
    <section 
      className={`w-[100%] relative flex px-4 py-4 rounded-xl bg-gradient-to-l from-gray-200 to-white ` + className}
      style={{boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)' , ...style}}
      id={id}
    >
      <CenteredImage src={getOwnerImg()} width={50} height={50} className='rounded-full min-w-[50px] mr-4' />
      <div className="text-wrapper">
        <h3 className='font-semibold text-xl text-textorange mb-1'>{group.name}</h3>
        <p className='text-sm'>{joinUserNamesWithCommas()}</p>
      </div>
      {
        isOwner()
        &&
        <div className="buttons-wrapper absolute top-4 right-4 flex gap-1 sm:flex-row flex-col">
          <p className='text-sm cursor-pointer'> <FaPenAlt /> </p>
          <p className='text-sm cursor-pointer'> <FaTrashAlt /> </p>
        </div>
      }
    </section>
  )
}

export default GroupCard