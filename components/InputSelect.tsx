'use client'

import React from 'react';
import './InputSelect.css';



interface Props {
  labelText: string;
  inputName: string;
  disabled?: boolean;
  onChange: (value: any) => void;
  value: string;
  className?: string;
  style?: React.CSSProperties;
  options: {value: string, label: string, extraInfo?: string}[];
}



const InputSelect = ({inputName, options = [], labelText, value, onChange, className = '', style = {}, disabled = false}: Props) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedOptionLabel, setselectedOptionLabel] = React.useState('');
  const [selectedOptionExtraInfo, setSelectedOptionExtraInfo] = React.useState('');


  function handleFocus() {
    setIsFocused(!isFocused);
  }

  function handleSelection(option: any) {
    onChange(option.value);
    setselectedOptionLabel(option.label);
    if (option.extraInfo) setSelectedOptionExtraInfo(option.extraInfo);
    setIsFocused(false);
  }

  function closeDialogOnEsc(e: KeyboardEvent) {
    if (e.key === 'Escape' || e.key === 'Esc') setIsFocused(false);
  }

  function closeDialogOnOutsideClick(e: MouseEvent) {
    if (
      (e.target as HTMLElement).classList.contains('options-container') ||
      (e.target as HTMLElement).classList.contains('select-option') ||
      (e.target as HTMLElement).classList.contains('select-click-area')
    ) return
    else {
      console.log('closing!!!!!!!!')
      setIsFocused(false);
    }
  }
  

  React.useEffect(() => {
    window.addEventListener('keydown', closeDialogOnEsc);
    return () => window.removeEventListener('keydown', closeDialogOnEsc);
  }, []);

  React.useEffect(() => {
    window.addEventListener('click', closeDialogOnOutsideClick);
    return () => window.removeEventListener('click', closeDialogOnOutsideClick);
  }, []);

  
  return (
    <div className={`select-input-container ` + className}>
      <div className="input-and-label-wrapper">
        <input 
          type="text" 
          name={inputName}
          id={inputName}
          value={value} 
          onChange={onChange} 
          className={'select-input' + ' ' + className}
          style={style}
          disabled={true}
        />
        <label 
          className={isFocused || value ? `select-input-label up ` : `select-input-label `}
          htmlFor={inputName}
        >
          {labelText}
        </label>
        <div className="select-click-area" onClick={handleFocus}>
          <p className='selected-option-label'>
            {selectedOptionLabel}
            {' '}
            {
              selectedOptionExtraInfo
              &&
              <small>{selectedOptionExtraInfo}</small>
            }
          </p>
        </div>
      </div>

      {
        isFocused
        &&
        <div className="options-container">
          {
            options.map(((option, idx) => (
              <div key={option.value} onClick={() => handleSelection(option)}>
                <p className='select-option' data-value={option.value}>
                  {option.label}
                  {' '}
                  {
                    option.extraInfo
                    &&
                    <small>{option.extraInfo}</small>
                  }
                </p>
              </div>
            )))
          }
        </div>
      }
    </div>
  )
}

export default InputSelect