"use client"; 

import { useState } from "react";
import { FaTachometerAlt, FaShieldAlt, FaUserTie } from "react-icons/fa";
import { useRouter } from "next/navigation"; 

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter(); 

  // Handle tab navigation and set active state
  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab); 
    router.push(route); 
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-3 flex justify-around">
      <button
        className={`flex flex-col items-center ${
          activeTab === "dashboard" ? "text-green-500" : ""
        }`}
        onClick={() => handleNavigation("dashboard", "/dashboard")}
      >
        <FaTachometerAlt className="text-2xl" />
      </button>

      <button
        className={`flex flex-col items-center ${
          activeTab === "police" ? "text-green-500" : ""
        }`}
        onClick={() => handleNavigation("police", "/camera")}
      >
        <FaShieldAlt className="text-2xl" />
      </button>

      <button
        className={`flex flex-col items-center ${
          activeTab === "policymakers" ? "text-green-500" : ""
        }`}
        onClick={() => handleNavigation("policyMaker", "/policyMaker")}
      >
        <FaUserTie className="text-2xl" />
      </button>
    </nav>
  );
}
