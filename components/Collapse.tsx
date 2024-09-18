'use client'

import React, { useEffect, useRef} from 'react'



interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const Collapse = ({ children, className = '', style = {}, isOpen = false, id='collapse-component' }: Props) => {
  const collapseComponent = useRef<HTMLDivElement>(null);


  function openCollapse() {
    if (collapseComponent.current) {
      collapseComponent.current.style.height = `${getChildrenHeight()}px`;
    }
  }

  function closeCollapse() {
    if (collapseComponent.current) {
      collapseComponent.current.style.height = '0px';
    }
  }

  function getChildrenHeight() {
    if (!collapseComponent.current) return 0;
    let totalHeight = 0;
    Array.from(collapseComponent.current.children).forEach(child => {
      const rect = child.getBoundingClientRect();
      const style = window.getComputedStyle(child);
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);
      totalHeight += rect.height + marginTop + marginBottom;
    });
    return totalHeight;
  }


  useEffect(() => {
    if (isOpen) {
      openCollapse();
    } else {
      closeCollapse();
    }
  }, [isOpen]);


  return (
    <div
      ref={collapseComponent}
      className={'w-[100%] transition-height duration-200 ease-linear overflow-hidden ' + className} 
      style={style} 
      id={id}
    >
      {children}
    </div>
  )
}

export default Collapse