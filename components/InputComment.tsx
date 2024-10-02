'use client';

import React, { useEffect, useRef } from 'react';
import { useToast } from '@/context/toastContext';
import { LuImagePlus } from "react-icons/lu";
import { resizeImage } from '@/utils/imageUpload';



interface Props {
  onChange: (event: { name: string, value: any }) => void;
  comment: string;
  preview: string;
}



const imageMaxSize = 300;




const InputComment = ({ onChange, comment, preview }: Props) => {
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
      inputRef.current.innerText = ''; // Clear the comment on first click
      setIsFirstClick(false); // Set to false to prevent clearing on subsequent clicks
    }
  };
  

  useEffect(() => { // only set the initial comment once - when the component mounts
    if (inputRef.current && inputRef.current.innerText !== comment) { inputRef.current.innerText = comment; }
  }, [comment]);

  useEffect(() => { // custom onChange handling for contentEditable element
    if (inputRef.current) { inputRef.current.addEventListener('input', handleInput); }
    return () => {  if (inputRef.current) { inputRef.current.removeEventListener('input', handleInput); }  };
  }, []);


  return (
    <div 
      className='w-[100%] h-[10rem] flex justify-between mb-4 bg-lightgray p-4 rounded-2xl overflow-y-auto'
      style={{boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)'}}
    >
      {/* comment input */}
      <div
        contentEditable={true}
        className='w-[100%] h-[100%] cursor-text border-none outline-none text-xl font-medium'
        ref={inputRef}
        suppressContentEditableWarning={true}
        onFocus={handleFocus}
      />

      {/* image preview & upload*/}
      <div className='relative'>
        {
          preview
          ?
          <div 
            className='cursor-pointer w-[50px] h-[50px] rounded-full absolute -top-2 -right-2 opacity-75'
            style ={{backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
          >
            <input type="file" max={1} multiple={false} accept='image/*' className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
          </div>
          :
          <div className='absolute top-0 right-0 cursor-pointer text-darkgray text-2xl'> 
            <input type="file" max={1} multiple={false} accept='image/*' className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
            <p className='cursor-pointer'> <LuImagePlus />  </p>
          </div>

        }
      </div>
      
    </div>
  );
};

export default InputComment;
