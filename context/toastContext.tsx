import { createContext, useContext, useState, useRef } from "react";
import Toast from "@/components/Toast";



interface ToastContextState {
  showToast: (text: string) => void;
}

interface ToastContextProviderProps {
  children: React.ReactNode;
}



const ToastContext = createContext<ToastContextState>({
  showToast: () => {}
})

export const ToastContextProvider: React.FC<ToastContextProviderProps> = ({ children }: {children: React.ReactNode}) => {
  const [isToastShown, setIsToastShown] = useState(false);
  const [toastText, setToastText] = useState('');
  const toastInterval = useRef<ReturnType<typeof setInterval> | null>(null);


  function hideToast() {
    setIsToastShown(false);
    if (toastInterval.current) clearInterval(toastInterval.current);
  }

  function showToast(text: string) {
    if (toastInterval.current) clearInterval(toastInterval.current);
    if (typeof text !== 'string') text = JSON.stringify(text);
    setToastText(text);
    setIsToastShown(true);
    toastInterval.current = setInterval(hideToast, 3000);
  }

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <Toast text={toastText} isToastShown={isToastShown} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext);