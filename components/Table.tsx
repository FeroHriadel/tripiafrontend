import { table } from 'console';
import React from 'react';
import './Table.css';



interface TableHeaderProps {
  headerText: string;
  headerContent?: React.ReactNode;
}



export const TableContainer = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className='table-container'>{children}</div>
  )
}

export const TableHeader = ({ headerText, headerContent }: TableHeaderProps) => {
  return (
    <div className='table-header'>
      <h3 className='table-header-text'>{headerText}</h3>
      <span className='header-content'>{headerContent}</span>
    </div>
  )
}

export const TableLine = ({ children, style = {} }: {children: React.ReactNode, style?: React.CSSProperties}) => {
  return (
    <div className='table-line' style={style}>{children}</div>
  )
}