'use client'

import StoreProvider from "@/redux/StoreProvider";
import CategoriesFetcher from "./CategoriesFetcher";
import { ToastContextProvider } from "@/context/toastContext";



export function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <>
      <StoreProvider>
        <ToastContextProvider>
          <CategoriesFetcher />
          {children}
        </ToastContextProvider>
      </StoreProvider>
    </>
  )
}
