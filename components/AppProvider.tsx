'use client'

import StoreProvider from "@/redux/StoreProvider";
import CategoriesFetcher from "./CategoriesFetcher";



export function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <>
      <StoreProvider>
        <CategoriesFetcher />
        {children}
      </StoreProvider>
    </>
  )
}
