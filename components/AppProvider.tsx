'use client'

import StoreProvider from "@/redux/StoreProvider";
import AppPreloader from "./AppPreloader";
import { ToastContextProvider } from "@/context/toastContext";
import { AuthContextProvider } from "@/context/authContext";



export function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <>
      <StoreProvider>
        <ToastContextProvider>
          <AuthContextProvider>
            <AppPreloader />
            {children}
          </AuthContextProvider>
        </ToastContextProvider>
      </StoreProvider>
    </>
  )
}
