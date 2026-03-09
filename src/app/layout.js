"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { globalContext } from "./utils/context/globalContext";
import { useState } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



// export const metadata = {
//   title: "vaccine Dispenser",
//   description: "Created by VaxGroup",
// };

export default function RootLayout({ children }) {
  const [user,setUser]=useState()
  return (
    <html lang="en">
      <globalContext.Provider value={{setUser:setUser,user:user}}></globalContext.Provider>
      <body>
        {children}
      </body>
    </html>
  );
}
