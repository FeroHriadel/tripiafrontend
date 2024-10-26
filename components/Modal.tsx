import React , { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './Modal.css';
import ButtonOrange from './ButtonOrange';
import ModalHeader from './ModalHeader';
import ModalDescription from './ModalDescription';



interface Props {
  open: boolean;
  header?: string;
  text?: string;
  children?: React.ReactNode;
  onClose: () => void;
}


const Modal = ({ header, text, children, open, onClose }: Props) => {
  function closeDialogOnEsc(e: KeyboardEvent) {
    if (e.key === 'Escape' || e.key === 'Esc') onClose();
  }

  function closeDialogOnOutsideClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-dialog-container')) onClose();
  }
  

  useEffect(() => {
    window.addEventListener('keydown', closeDialogOnEsc);
    return () => window.removeEventListener('keydown', closeDialogOnEsc);
  }, []);


  return (
    <div className={open ? 'modal-dialog-container shown' : 'modal-dialog-container'} onClick={closeDialogOnOutsideClick}>
      <div className="modal-dialog" style={{background: 'white'}}>
        <FaTimes className='close-icon' onClick={onClose} />
        {header && <ModalHeader text={header} />}
        {text && <ModalDescription text={text} />}
        {children}
      </div>
    </div>
  )
}



export default Modal