import PrivatePageRouteGuard from "@/components/RouteGuardPrivate";



const AdminLayout = ({ children }: Readonly<{children: React.ReactNode}>) => {
  return (
    <>
      <PrivatePageRouteGuard/>
      {children}
    </>
  )
}

export default AdminLayout