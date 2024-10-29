'use client';

import React, { useEffect, useRef } from 'react';
import ContentSectionButton from './ContentSectionButton';
import { useToast } from '@/context/toastContext';
import { LuImagePlus } from "react-icons/lu";
import { resizeImage } from '@/utils/imageUpload';



interface Props {
  onChange: (event: { name: string, value: any }) => void;
  onSubmit: () => void;
  loading: boolean;
  comment: string;
  preview: string;
}



const imageMaxSize = 300;
const hint = 'Write something...'	



const InputComment = ({ onChange, onSubmit, loading, comment, preview }: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [isFirstClick, setIsFirstClick] = React.useState(true);


  function handleInput() {
    if (inputRef.current) { onChange({ name: 'comment', value: inputRef.current.innerText }); }
  };

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];
    if (!file) return;
    const resizedImage = await resizeImage(file, imageMaxSize);
    if (resizedImage.error) return showToast(resizedImage.error);
    else onChange({name: 'preview', value: {preview: resizedImage.base64, fileName: file.name}});
  }

  function handleFocus() {
    if (isFirstClick && inputRef.current) {
      inputRef.current.innerText = ''; // clear the comment on first click
      setIsFirstClick(false);
    }
  };

  async function addComment() {
    if (!comment || comment === hint) return showToast('Please enter a comment');
    else showToast('Saving comment...'); onSubmit();
  }
  

  useEffect(() => { // only set the initial comment once - when the component mounts
    if (inputRef.current && inputRef.current.innerText !== comment) { inputRef.current.innerText = comment; }
  }, [comment]);

  useEffect(() => { // custom onChange handling for contentEditable element
    if (inputRef.current) { inputRef.current.addEventListener('input', handleInput); }
    return () => {  if (inputRef.current) { inputRef.current.removeEventListener('input', handleInput); }  };
  }, []);


  return (
    <div 
      className={`w-[100%] h-[15rem] relative flex flex-col gap-4 mb-8 bg-lightgray p-4 rounded-2xl ${loading && 'opacity-50 pointer-events-none'}`}
      style={{boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)'}}
    >

      {/* comment input */}
      <div
        contentEditable={true}
        className='w-[100%] h-[100%] cursor-text border-none outline-none text-base text-left xs:text-xl font-medium overflow-y-auto'
        ref={inputRef}
        suppressContentEditableWarning={true}
        onFocus={handleFocus}
      />

      {/* image preview & upload*/}
      <div className='absolute top-4 right-4'>
        {
          preview
          ?
          <div 
            className='relative cursor-pointer w-[50px] h-[50px] rounded-full'
            style ={{backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
          >
            <input type="file" max={1} multiple={false} accept='image/*' className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
          </div>
          :
          <div className='relative cursor-pointer text-darkgray text-2xl'> 
            <input type="file" max={1} multiple={false} accept='image/*' className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
            <p className='cursor-pointer'> <LuImagePlus />  </p>
          </div>
        }
      </div>
      
      {/* post button */}
      <ContentSectionButton text='Post' onClick={addComment} className='min-h-[3.5rem]' />
    </div>
  );
};

export default InputComment;
