import React from 'react';
import './InputTextarea.css';



interface Props {
  labelText: string;
  inputName: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  className?: string;
  style?: React.CSSProperties;
}



const InputTextarea = ({ inputName, labelText, value, onChange, className = '', style = {}, disabled = false }: Props) => {
  return (
    <div className={`textarea-input-container ` + className}>
      <div className="textarea-and-label-wrapper">
      <textarea 
        name={inputName}
        id={inputName}
        value={value} 
        onChange={onChange} 
        className={'textarea-input'}
        style={style}
        disabled={disabled}
      />

      <label className={value ? `textarea-input-label up` : `textarea-input-label`} htmlFor={inputName}>
        {labelText}
      </label>
      </div>
    </div>
  )
}

export default InputTextarea