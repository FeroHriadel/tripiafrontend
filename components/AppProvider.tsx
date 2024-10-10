'use client'

import StoreProvider from "@/redux/StoreProvider";
import AppPreloader from "./AppPreloader";
import { ToastContextProvider } from "@/context/toastContext";
import { AuthContextProvider } from "@/context/authContext";
import { WSContextProvider } from "@/context/wsContext";



export function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <>
      <StoreProvider>
        <ToastContextProvider>
          <AuthContextProvider>
            <WSContextProvider>
              <AppPreloader />
              {children}
            </WSContextProvider>
          </AuthContextProvider>
        </ToastContextProvider>
      </StoreProvider>
    </>
  )
}
