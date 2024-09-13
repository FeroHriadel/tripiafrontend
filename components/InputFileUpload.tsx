import ContentSectionButton from "./ContentSectionButton"


type Props = {
    text?: string;
    className?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    max?: string;
    accept?: string;
    onChange: (e: any) => any
}

const InputFileUpload = ({ 
    text = 'Upload Image', 
    className = '', 
    id = 'image-input',
    name = 'image-input', 
    disabled = false,
    max = '1', 
    accept = 'image/*', 
    onChange 
  }: Props) => {
  return (
    <ContentSectionButton text={text} className={'w-[100%] relative cursor-pointer ' + className} type="button" disabled={disabled}>
        <input 
            name={name}
            id={id}
            type="file"
            max={max}
            multiple={+max > 1 ? true : false}
            accept={accept}
            className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer"
            onChange={onChange}
            disabled={disabled}
        />
    </ContentSectionButton>
  )
}

export default InputFileUpload