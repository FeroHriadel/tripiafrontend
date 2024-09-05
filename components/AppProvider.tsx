'use client'

import StoreProvider from "@/redux/StoreProvider";
import CategoriesFetcher from "./CategoriesFetcher";
import { ToastContextProvider } from "@/context/toastContext";
import { AuthContextProvider } from "@/context/authContext";



export function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <>
      <StoreProvider>
        <ToastContextProvider>
          <AuthContextProvider>
            <CategoriesFetcher />
            {children}
          </AuthContextProvider>
        </ToastContextProvider>
      </StoreProvider>
    </>
  )
}
