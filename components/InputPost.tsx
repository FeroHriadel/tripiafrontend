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
  post: string;
  previews: string[];
}



const imageMaxSize = 1500;
const maxImages = 10;
const hint = 'Write something...'	



const InputPost = ({ onChange, onSubmit, loading, post, previews }: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [isFirstClick, setIsFirstClick] = React.useState(true);


  function handleInput() {
    if (inputRef.current) { onChange({ name: 'post', value: inputRef.current.innerText }); }
  };

  async function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > maxImages) showToast(`You can only upload up to ${maxImages} images. More images will be skipped.`);
    const selectedFiles = Array.from(files).slice(0, 10);
    const previews = [];
    const fileNames = [];
    for (const file of selectedFiles) {
      const resizedImage = await resizeImage(file, imageMaxSize);
      if (resizedImage.error) { showToast(resizedImage.error);  continue; }
      previews.push(resizedImage.base64);
      fileNames.push(file.name);
    }
    onChange({ name: 'previews', value: {previews, fileNames} });
  }

  function handleFocus() {
    if (isFirstClick && inputRef.current) {
      inputRef.current.innerText = ''; // clear the comment on first click
      setIsFirstClick(false);
    }
  };

  async function addPost() {
    if (!post || post === hint) return showToast('Please enter a post');
    else showToast('Saving post...'); onSubmit();
  }
  

  useEffect(() => { // only set the initial comment once - when the component mounts
    if (inputRef.current && inputRef.current.innerText !== post) { inputRef.current.innerText = post; }
  }, [post]);

  useEffect(() => { // custom onChange handling for contentEditable element
    if (inputRef.current) { inputRef.current.addEventListener('input', handleInput); }
    return () => {  if (inputRef.current) { inputRef.current.removeEventListener('input', handleInput); }  };
  }, []);


  return (
    <div 
      className={`w-[100%] min-h-[15rem] relative flex flex-col justify-between gap-4 mb-8 bg-lightgray p-4 rounded-2xl ${loading && 'opacity-50 pointer-events-none'}`}
      style={{boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)'}}
    >
      {/* post input */}
      <div
        contentEditable={true}
        className='w-[100%] h-[100%] cursor-text border-none outline-none text-base xs:text-xl font-medium overflow-y-auto'
        ref={inputRef}
        suppressContentEditableWarning={true}
        onFocus={handleFocus}
      />

      {/* uploader */}
      <div className='absolute top-4 right-4'>
        <div className='relative cursor-pointer text-darkgray text-2xl'> 
          <input type="file" max={maxImages} multiple={true} accept='image/*' className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer" onChange={handleImagesChange} />
          <p className='cursor-pointer'> <LuImagePlus />  </p>
        </div>
      </div>
      
      {/* images previews */}
      <div className='flex flex-wrap gap-2'>
        {
          previews.map((preview, idx) => (
            <div
              key={`#PREVIEW-${idx}`}
              className='relative cursor-pointer w-[50px] min-w-[50px] h-[50px] min-h-[50px] rounded-full'
              style ={{backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
            />
          ))
        }
      </div>
      
      {/* post button */}
      <ContentSectionButton text='Post' onClick={addPost} className='min-h-[3.5rem]' />
    </div>
  );
};

export default InputPost;
