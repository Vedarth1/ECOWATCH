"use client";

import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "../components/ui/bottomNav";
import { FaBars, FaUserPlus, FaCamera } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../context/WebSocketContext";
import { RegionProvider, useRegion } from "../context/regionContext";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

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

interface RegionFormData {
  regionName: string;
  city: string;
  state: string;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { regionData, setRegionData } = useRegion();
  const { logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegionForm, setShowRegionForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const storedRegion = localStorage.getItem("regionData");

      if (!storedRegion) {
        setShowRegionForm(true);
      } else {
        try {
          const parsedRegion = JSON.parse(storedRegion);
          setRegionData(parsedRegion);
          setShowRegionForm(false);
        } catch (error) {
          console.error("Error parsing stored region data:", error);
          setShowRegionForm(true);
        }
      }
    } else {
      setIsLoggedIn(false);
      setShowRegionForm(false);
    }
  }, [setRegionData]);

  const handleRegionSubmit = async (formData: RegionFormData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:8000/api/region", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setRegionData(formData);
        localStorage.setItem("regionData", JSON.stringify(formData));
        setShowRegionForm(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting region:", error);
      alert("Failed to submit region details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("regionData");
    setShowRegionForm(false);
    setIsLoggedIn(false);
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openCamera = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const handleImageCapture = async (imageSrc: string) => {
    setIsLoading(true);
    try {
      const base64Response = await fetch(imageSrc);
      const blob = await base64Response.blob();

      closeCamera();
      await sendImageToServer(blob);
      router.push("/camera");
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendImageToServer = async (blob: Blob) => {
    if (!regionData) {
      alert("Please submit region details first");
      setShowRegionForm(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", blob, "image.jpg");
    formData.append("regionName", regionData.regionName);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/api/puc", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <header className="flex justify-between items-center bg-black text-white p-4 z-20 relative">
        <button className="text-white text-2xl" onClick={toggleSidebar} aria-label="Menu">
          <FaBars />
        </button>
        <h1 className="text-lg font-bold text-center flex-grow">ECOWATCH</h1>
        <button className="text-white text-2xl mx-2" onClick={openCamera} aria-label="Camera">
          <FaCamera />
        </button>
        {!isLoggedIn && (
          <button
            className="text-white text-2xl mx-2"
            onClick={() => router.push("/register")}
            aria-label="Register"
          >
            <FaUserPlus />
          </button>
        )}
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-black text-white p-4 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Menu</h2>
          <button className="text-white text-2xl" onClick={closeSidebar} aria-label="Close menu">
            &times;
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            {[
              { name: "Home", path: "/" },
              { name: "Dashboard", path: "/dashboard", requiresAuth: true },
              { name: "About", path: "/about" },
              { name: "Privacy Policy", path: "/privacy" },
              { name: "User Guide", path: "/userGuide" },
            ].map(
              (item) =>
                (!item.requiresAuth || (item.requiresAuth && isLoggedIn)) && (
                  <li key={item.name}>
                    <button
                      className="text-white w-full text-left py-2 px-4 hover:bg-gray-800 rounded transition-colors"
                      onClick={() => {
                        router.push(item.path);
                        closeSidebar();
                      }}
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {isLoggedIn && (
              <li>
                <button
                  className="text-white w-full text-left py-2 px-4 hover:bg-gray-800 rounded transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main
        className={`flex-grow p-4 overflow-auto mb-16 z-10 transition-opacity duration-300 bg-black ${
          isSidebarOpen ? "opacity-30" : "opacity-100"
        }`}
      >
        {isLoggedIn && showRegionForm ? (
          <div className="max-w-md mx-auto mt-8 p-6 bg-black rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center text-white">
              Please Enter Your Region Details
            </h2>
            <RegionForm onSubmit={handleRegionSubmit} />
          </div>
        ) : (
          children
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}

      {/* Camera Component */}
      {isCameraOpen && <CameraComponent onCapture={handleImageCapture} onClose={closeCamera} />}
    </div>
  );
}

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
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
