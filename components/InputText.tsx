import React from 'react';
import './InputText.css';



interface Props {
  labelText: string;
  inputName: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  className?: string;
  style?: React.CSSProperties;
  type?: string;
  children?: React.ReactNode;
}



const InputText = ({ inputName, labelText, value, onChange, type = 'text', className = '', style = {}, disabled = false, children }: Props) => {
  return (
    <div className={`text-input-container ` + className}>
      <div className="input-and-label-wrapper">
        <input 
          type={type} 
          name={inputName}
          id={inputName}
          value={value} 
          onChange={onChange} 
          className={'text-input' + ' ' + className}
          style={style}
          disabled={disabled}
          autoComplete='off'
        />

        <label className={value ? `text-input-label up` : `text-input-label`} htmlFor={inputName}>
          {labelText}
        </label>
      </div>

      {children}
    </div>
  )
}

export default InputText