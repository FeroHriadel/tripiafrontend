import React , { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './ConfirmDialog.css';
import ButtonOrange from './ButtonOrange';



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
  

  useEffect(() => {
    window.addEventListener('keydown', closeDialogOnEsc);
    return () => window.removeEventListener('keydown', closeDialogOnEsc);
  }, []);


  return (
    <div className={open ? 'confirm-dialog-container shown' : 'confirm-dialog-container'}>
      <div className="confirm-dialog">
        <FaTimes className='close-icon' onClick={onClose} />
        <p>{text}</p>
        <span className='w-[100%] flex flex-col sm:flex-row justify-center items-center gap-4 my-8'>
          <ButtonOrange text='No, Close' className='w-[100%] sm:w-[200px]' onClick={onClose} />
          <ButtonOrange text='Yes, Delete' className='w-[100%] sm:w-[200px]' onClick={onConfirm} />
        </span>
      </div>
    </div>
  )
}



export default ConfirmDialog