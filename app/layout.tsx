import type { Metadata } from "next";
import { AppProvider } from "@/components/AppProvider";
import Navbar from "@/components/Navbar";
import { montserrat } from "./fonts";
import "./globals.css";



export const metadata: Metadata = {
  title: "Tripia",
  description: "Find mates for your trip",
  openGraph: {
    title: "Tripia",
    description: "Find mates for your trip",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Tripia",
    locale: "en_US",
    type: "website",
    images: [{url: `${process.env.NEXT_PUBLIC_APP_URL}/images/tripiaTheme.png`, width: 300, height: 300, alt: 'Tripia'}]
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL
  }
};



export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
