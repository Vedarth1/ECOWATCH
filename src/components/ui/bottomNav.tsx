"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { FaTachometerAlt, FaShieldAlt, FaUserTie } from "react-icons/fa";

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter(); 

  // Function to handle tab click and navigate
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the respective route
    if (tab === "dashboard") {
      router.push("/dashboard"); 
    } else if (tab === "police") {
      router.push("/police"); // 
    } else if (tab === "policymakers") {
      router.push("/policyMaker"); 
    }
  };

  return (
    <nav className="flex justify-around bg-gray-800 text-white py-3">
      <button
        className={`flex flex-col items-center ${
          activeTab === "dashboard" ? "text-green-500" : ""
        }`}
        onClick={() => handleTabClick("dashboard")}
      >
        <FaTachometerAlt className="text-2xl" />
      </button>

      <button
        className={`flex flex-col items-center ${
          activeTab === "police" ? "text-green-500" : ""
        }`}
        onClick={() => handleTabClick("police")}
      >
        <FaShieldAlt className="text-2xl" />
      </button>

      <button
        className={`flex flex-col items-center ${
          activeTab === "policymakers" ? "text-green-500" : ""
        }`}
        onClick={() => handleTabClick("policymakers")}
      >
        <FaUserTie className="text-2xl" />
      </button>
    </nav>
  );
}
