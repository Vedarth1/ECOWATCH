"use client";

import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "../components/ui/bottomNav";
import { FaBars, FaUserPlus, FaCamera } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; 
import { useState } from "react";
import dynamic from 'next/dynamic';
import { WebSocketProvider } from '../context/WebSocketContext'; 

const CameraComponent = dynamic(() => import('../components/utils/cameraUtility'), { ssr: false });

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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const handleImageCapture = async (imageSrc: string | URL | Request) => {
    setIsLoading(true);
    const base64Response = await fetch(imageSrc);
    const blob = await base64Response.blob();

    closeCamera();
    await sendImageToServer(blob);
    setIsLoading(false);
    router.push('/camera'); 
  };

  const sendImageToServer = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/puc/process_image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Image processed successfully:', result);
      } else {
        console.error('Failed to process image');
      }
    } catch (error) {
      console.error('Error sending image:', error);
    }
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WebSocketProvider>
          <div className="flex flex-col h-screen">
            <header className="flex justify-between items-center bg-black-600 text-white p-4 z-20 relative">
              <button className="text-white text-2xl" onClick={toggleSidebar}>
                <FaBars />
              </button>
              <h1 className="text-lg font-bold text-center flex-grow">ECOWATCH</h1>
              <button className="text-white text-2xl mx-2" onClick={openCamera}>
                <FaCamera />
              </button>
              <button className="text-white text-2xl mx-2" onClick={() => router.push("/register")}>
                <FaUserPlus />
              </button>
            </header>

            {isSidebarOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-70 z-30" onClick={closeSidebar}></div>
            )}

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
                  { name: "User Guide", path: "/user-guide" },
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

            <main className={`flex-grow p-4 overflow-auto mb-16 z-10 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-30' : 'opacity-100'}`}>
              {children}
            </main>

            <BottomNav />

            {isLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                <div className="text-white text-2xl">Loading...</div>
              </div>
            )}

            {isCameraOpen && (
              <CameraComponent onCapture={handleImageCapture} onClose={closeCamera} />
            )}
          </div>
        </WebSocketProvider>
      </body>
    </html>
  );
}
