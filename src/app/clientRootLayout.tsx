"use client";

import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "../components/ui/bottomNav";
import { FaBars, FaUserPlus, FaCamera } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; 
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode; 
}) {
  const router = useRouter(); // Initialize the router for client-side navigation

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col h-screen">
          {/* Top Navbar */}
          <header className="flex justify-between items-center bg-green-600 text-white p-4">
            {/* Hamburger Menu */}
            <button className="text-white text-2xl">
              <FaBars />
            </button>

            <h1 className="text-lg font-bold text-center flex-grow">
              ECOWATCH
            </h1>

            {/* Camera Icon */}
            <button
              className="text-white text-2xl mx-2" 
              onClick={() => router.push("/camera")} 
            >
              <FaCamera />
            </button>

            {/* Register Icon */}
            <button
              className="text-white text-2xl mx-2" 
              onClick={() => router.push("/register")} 
            >
              <FaUserPlus />
            </button>
          </header>

          {/* Main Content */}
          <main className="flex-grow p-4 overflow-auto mb-16">{children}</main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}
