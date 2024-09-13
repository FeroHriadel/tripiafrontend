import React, { forwardRef } from 'react';



interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}



const Container = forwardRef<HTMLDivElement, Props>(({ children, className = '', id, style = {} }, ref) => {
  return (
    <div ref={ref} className={`mx-auto w-[100%] max-w-[1000px] ` + className} style={style} id={id}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';  // Required when using forwardRef



export default Container;
