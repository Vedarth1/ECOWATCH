"use client"; // This tells Next.js that this is a Client Component

import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "../components/ui/bottomNav";
import { FaBars, FaUserPlus } from "react-icons/fa"; // Import icons
import { useRouter } from "next/navigation"; // useRouter for client-side navigation

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
  const router = useRouter(); 

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

            <h1 className="text-lg font-bold text-center flex-grow">ECOWATCH</h1>

            {/* Register Icon */}
            <button
              className="text-white text-2xl"
              onClick={() => router.push("/register")} // Navigate to /register route on click
            >
              <FaUserPlus />
            </button>
          </header>

          {/* Main Content */}
          <main className="flex-grow p-4 overflow-auto">{children}</main>

          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
