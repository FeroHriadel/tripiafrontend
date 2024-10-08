import type { Metadata } from "next";
import { AppProvider } from "@/components/AppProvider";
import Navbar from "@/components/Navbar";
import { montserrat } from "./fonts";
import "./globals.css";



export const metadata: Metadata = {
  title: "Tripia",
  description: "Team up for your next trip",
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
  );
}
