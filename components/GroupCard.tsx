import React, { useState, useEffect } from 'react';
import { Group, UserProfile } from '@/types';
import { apiCalls } from '@/utils/apiCalls';
import CenteredImage from '@/components/CenteredImage';
import { useAuth } from '@/context/authContext';
import { FaTrashAlt, FaPenAlt } from 'react-icons/fa';
import ConfirmDialog from '@/components/ModalConfirmDialog';
import ContentSectionButton from '@/components/ContentSectionButton';
import InputText from '@/components/InputText';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';



interface Props {
  group: Group;
  onDelete: (groupId: string) => void;
  onUpdate: (props: {groupId: string, name: string}) => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}



const GroupCard = ({ className, style, id, group, onDelete, onUpdate }: Props) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [confirmShown, setConfirmShown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState(group.name);
  const { user } = useAuth();
  const router = useRouter();


  function joinUserNamesWithCommas() {
    const userNames = [...users].map(u => u.nickname);
    return userNames.join(', ');
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

  function isOwner() { 
    return group.createdBy === user?.email; 
  }

  function openConfirm(e: React.MouseEvent<HTMLParagraphElement>) { 
    e.stopPropagation(); 
    setConfirmShown(true); 
  }

  function closeConfirm() { 
    setConfirmShown(false); 
  }

  function openModal(e: React.MouseEvent<HTMLParagraphElement>) { 
    e.stopPropagation();
    setModalOpen(true); 
    setGroupName(group.name); 
  }

  function closeModal() { 
    setModalOpen(false); 
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) { setGroupName(e.target.value); }

  function handleUpdate() { 
    onUpdate({groupId: group.id, name: groupName}); 
    closeModal(); 
  }

  function redirectToGroup() { 
    router.push(`/profile/groups/${group.id}`); 
  }

  function renderModalContent() {
    return (
      <div className='w-[100%]'>
        <br /><br /><br />
        <InputText inputName='groupName' labelText='group name' value={groupName} onChange={handleChange} className='mb-8' />
        <ContentSectionButton text='OK' onClick={handleUpdate}  className='mb-4' />
        <ContentSectionButton text='Cancel' onClick={closeModal} className='mb-4' />
      </div>
    );
  }


  useEffect(() => { getUserNames(); }, []) //get group.members names to show on the card


  return (
    <>
      <section 
        className={`w-[100%] relative flex px-4 py-4 rounded-xl cursor-pointer bg-gradient-to-l from-gray-200 to-white ` + className}
        style={{boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)' , ...style}}
        id={id}
        onClick={redirectToGroup}
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
            <p className='text-sm cursor-pointer' onClick={openModal}> <FaPenAlt /> </p>
            <p className='text-sm cursor-pointer' onClick={openConfirm}> <FaTrashAlt /> </p>
          </div>
        }      
      </section>

      <ConfirmDialog open={confirmShown} text="Delete this Group?" onClose={closeConfirm} onConfirm={() => onDelete(group.id)} />

      <Modal header='Edit Group' text='Please enter a new name and click OK' open={modalOpen} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </>
  )
}

export default GroupCard