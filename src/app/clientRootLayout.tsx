"use client";

import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "../components/ui/bottomNav";
import { FaBars, FaUserPlus, FaCamera } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../context/WebSocketContext";

// Import RegionContext
import { RegionProvider, useRegion } from "../context/regionContext";

const CameraComponent = dynamic(() => import("../components/utils/cameraUtility"), { ssr: false });
const RegionForm = dynamic(() => import("../components/utils/regionFormUtility"), { ssr: false });

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

function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { regionData, setRegionData } = useRegion();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegionForm, setShowRegionForm] = useState(true);

  // Check login status and load region data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRegion = localStorage.getItem('regionData');
    
    setIsLoggedIn(!!token);
    
    if (storedRegion) {
      setRegionData(JSON.parse(storedRegion));
      setShowRegionForm(false);
    }
  }, [setRegionData]);

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

  const handleFormSubmit = async (formData: { regionName: string; city: string; state: string }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/region", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Region details submitted successfully:", result);
        setRegionData(formData); // Store region data in context
        localStorage.setItem('regionData', JSON.stringify(formData)); // Also store in localStorage
        setShowRegionForm(false);
      } else {
        console.error("Failed to submit region details");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleImageCapture = async (imageSrc: string | URL | Request) => {
    setIsLoading(true);
    const base64Response = await fetch(imageSrc);
    const blob = await base64Response.blob();

    closeCamera();
    await sendImageToServer(blob);
    setIsLoading(false);
    router.push("/camera");
  };

  const sendImageToServer = async (blob: Blob) => {
    if (!regionData && !localStorage.getItem('regionData')) {
      console.error("No region data available");
      alert("Please submit region details first");
      setShowRegionForm(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    // Add region name to the form data
    const currentRegion = regionData || JSON.parse(localStorage.getItem('regionData') || '{}');
    formData.append("regionName", currentRegion.regionName);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/api/puc", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Image processed successfully:", result);
      } else {
        const errorData = await response.json();
        console.error("Failed to process image:", errorData);
        alert(errorData.message || "Failed to process image");
      }
    } catch (error) {
      console.error("Error sending image:", error);
      alert("Error sending image to server");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center bg-black text-white p-4 z-20 relative">
        <button className="text-white text-2xl" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1 className="text-lg font-bold text-center flex-grow">ECOWATCH</h1>
        <button className="text-white text-2xl mx-2" onClick={openCamera}>
          <FaCamera />
        </button>
        <button
          className="text-white text-2xl mx-2"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isLoggedIn ? router.push("/register") : router.push("/register");
          }}
        >
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
          <button className="text-white text-2xl" onClick={closeSidebar}>
            &times;
          </button>
        </div>
        <ul className="space-y-4">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Privacy Policy", path: "/Privacy" },
            { name: "User Guide", path: "/userGuide" },
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

      <main
        className={`flex-grow p-4 overflow-auto mb-16 z-10 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-30" : "opacity-100"
        }`}
      >
        {isLoggedIn && showRegionForm ? (
          <RegionForm onSubmit={handleFormSubmit} />
        ) : (
          children
        )}
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
  );
}

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RegionProvider>
          <WebSocketProvider>
            <MainLayout>{children}</MainLayout>
          </WebSocketProvider>
        </RegionProvider>
      </body>
    </html>
  );
}