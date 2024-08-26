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
}



const InputText = ({ inputName, labelText, value, onChange, className = '', style = {}, disabled = false }: Props) => {
  return (
    <div className={`text-input-container ` + className}>
      <div className="input-and-label-wrapper">
      <input 
        type="text" 
        name={inputName}
        id={inputName}
        value={value} 
        onChange={onChange} 
        className={'text-input' + ' ' + className}
        style={style}
        disabled={disabled}
      />

      <label className={value ? `text-input-label up` : `text-input-label`} htmlFor={inputName}>
        {labelText}
      </label>
      </div>
    </div>
  )
}

export default InputText