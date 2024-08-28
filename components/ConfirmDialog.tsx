import React , { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './ConfirmDialog.css';
import ButtonOrange from './ButtonOrange';
import ModalHeader from './ModalHeader';
import ModalDescription from './ModalDescription';



interface Props {
  open: boolean;
  text?: string;
  onConfirm: () => void;
  onClose: () => void;
}


const ConfirmDialog = ({ text = 'Are you sure?', open, onConfirm, onClose }: Props) => {
  function closeDialogOnEsc(e: KeyboardEvent) {
    if (e.key === 'Escape' || e.key === 'Esc') onClose();
  }

  function closeDialogOnOutsideClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('confirm-dialog-container')) onClose();
  }
  

  useEffect(() => {
    window.addEventListener('keydown', closeDialogOnEsc);
    return () => window.removeEventListener('keydown', closeDialogOnEsc);
  }, []);


  return (
    <div className={open ? 'confirm-dialog-container shown' : 'confirm-dialog-container'} onClick={closeDialogOnOutsideClick}>
      <div className="confirm-dialog">
        <FaTimes className='close-icon' onClick={onClose} />
        <ModalHeader text='Are you sure?' />
        <ModalDescription text={text} />
        <span className='w-[100%] flex flex-col sm:flex-row justify-center items-center gap-4 my-4'>
          <ButtonOrange text='No' className='w-[100%] sm:w-[200px] h-auto py-1' onClick={onClose} />
          <ButtonOrange text='Yes' className='w-[100%] sm:w-[200px] h-auto py-1' onClick={onConfirm} />
        </span>
      </div>
    </div>
  )
}



export default ConfirmDialog