"use client";

import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "../components/ui/bottomNav";
import { FaBars, FaUserPlus, FaCamera } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; 
import { useState } from "react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col h-screen">
          {/* Top Navbar */}
          <header className="flex justify-between items-center bg-black-600 text-white p-4 z-20 relative">
            <button className="text-white text-2xl" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <h1 className="text-lg font-bold text-center flex-grow">ECOWATCH</h1>
            <button className="text-white text-2xl mx-2" onClick={() => router.push("/camera")}>
              <FaCamera />
            </button>
            <button className="text-white text-2xl mx-2" onClick={() => router.push("/register")}>
              <FaUserPlus />
            </button>
          </header>

          {/* Sidebar Overlay */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-30" onClick={closeSidebar}></div>
          )}

          {/* Sidebar - adjusted width to 30% of screen */}
          <div
            className={`fixed top-0 left-0 w-3/10 max-w-xs h-full bg-black-700 text-white p-4 z-40 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Menu</h2>
              <button className="text-white text-2xl" onClick={closeSidebar}>&times;</button>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" }, 
                { name: "About", path: "./(menubar)/about/page.tsx" }, 
                { name: "Privacy Policy", path: "/privacy-policy" }, 
                { name: "User Guide", path: "/user-guide" }
              ].map((item) => (
                <li key={item.name}>
                  <button 
                    className="text-white w-full text-left py-2 px-4 hover:bg-black-600 rounded transition-colors"
                    onClick={() => { 
                      router.push(item.path); 
                      closeSidebar(); 
                    }}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content - adjust opacity when sidebar is open */}
          <main className={`flex-grow p-4 overflow-auto mb-16 z-10 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-30' : 'opacity-100'}`}>
            {children}
          </main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}
