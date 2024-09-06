import React from 'react';
import AdminRouteGuard from '@/components/RouteGuardAdmin';



const AdminLayout = ({ children }: Readonly<{children: React.ReactNode}>) => {
  return (
    <>
      <AdminRouteGuard/>
      {children}
    </>
  )
}

export default AdminLayout