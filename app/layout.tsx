import type { Metadata } from "next";
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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
