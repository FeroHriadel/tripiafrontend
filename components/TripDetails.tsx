import React from 'react';
import InputText from '@/components/InputText'
import InputSelect from '@/components/InputSelect'
import InputTextarea from '@/components/InputTextarea'
import ContentSectionDescription from '@/components/ContentSectionDescription'
import ContentSectionHeader from '@/components/ContentSectionHeader'
import { LuImagePlus } from "react-icons/lu";
import { TripInput } from '@/types';
import { useAppSelector } from '@/redux/store';
import { resizeImage } from '@/utils/imageUpload';
import { useToast } from '@/context/toastContext';



interface Props {
  handleChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  trip: TripInput;
  loading: boolean;
}

const tripImageMaxSize = 500; 



const TripDetails = ({ trip, loading, handleChange }: Props) => {
  const [preview, setPreview] = React.useState<string>('');
  const [fileName, setFileName] = React.useState<string>('');
  const categories = useAppSelector((state) => state.categories);
  const { showToast } = useToast();


  function mapCategoriesToOptions() {
    const options = [];
    for (const category of categories) {
      options.push({value: category.id, label: category.name});
    }
    return options
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];
    const resizedImage = await resizeImage(file, tripImageMaxSize);
    if (resizedImage.error) return showToast(resizedImage.error);
    else { setPreview(resizedImage.base64); setFileName(file.name) };
  }

  return (
    <aside className='w-[100%] flex flex-col my-4'>
      <ContentSectionHeader text='Add More Details' style={{lineHeight: '2rem', fontSize: '1.5rem'}} />
      <ContentSectionDescription text='Add more details to find' className='text-xl xs:text-xl md:text-xl'/>
      <ContentSectionDescription text='like-minded companions easier' className='text-xl xs:text-xl md:text-xl mb-4'/>
      <div 
        className='rounded-2xl bg-lightgray w-[100%] h-[20rem] mb-4 relative cursor-pointer'
        style = {preview ? {backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'} : {}}
      >
        <p className='absolute top-4 right-4 text-darkgray text-2xl cursor-pointer'> <LuImagePlus /> </p>
        {
          !preview 
          &&
          <>
            <span className='absolute top-4 left-8 text-darkgray font-semibold text-xl'>upload image</span>
          </>
        }
        <input 
            type="file"
            max={1}
            multiple={false}
            accept='image/*'
            className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
      </div>
      <InputTextarea inputName='requirements' labelText='requirements' value={trip.requirements!} onChange={handleChange} disabled={loading} className='mb-4'/>
      <InputText inputName='keyWords' labelText={trip.keyWords ? 'key words' : 'key words (comma separated)'} value={trip.keyWords!} onChange={handleChange} disabled={loading} className='mb-4' />
      <InputSelect inputName='category' labelText='category' value={trip.category!} onChange={handleChange} options={mapCategoriesToOptions()} disabled={loading} className='mb-4' />
    </aside>
  )
}

export default TripDetails