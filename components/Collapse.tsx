'use client'

import React, { useEffect, useRef } from 'react';

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
      const newHeight = `${getChildrenHeight()}px`;
      if (collapseComponent.current.style.height !== newHeight) {
        collapseComponent.current.style.height = newHeight;
      }
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

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (isOpen) {
        openCollapse(); // Recalculate height when children change
      }
    });

    // Observe changes in children sizes
    const observeChildren = () => {
      if (collapseComponent.current) {
        Array.from(collapseComponent.current.children).forEach((child) => {
          resizeObserver.observe(child);
        });
      }
    };

    observeChildren(); // Start observing children

    return () => {
      if (collapseComponent.current) {
        resizeObserver.disconnect(); // Cleanup observer
      }
    };
  }, [isOpen, children]); // Also observe the children prop for changes

  return (
    <div
      ref={collapseComponent}
      className={'w-[100%] transition-height duration-200 ease-linear overflow-hidden ' + className} 
      style={style} 
      id={id}
    >
      {children}
    </div>
  );
}

export default Collapse;
