"use client"; // Client-side component

import { useState } from "react";
import { FaTachometerAlt, FaShieldAlt, FaUserTie } from "react-icons/fa";

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-3 flex justify-around">
      <button
        className={`flex flex-col items-center ${
          activeTab === "dashboard" ? "text-green-500" : ""
        }`}
        onClick={() => setActiveTab("dashboard")}
      >
        <FaTachometerAlt className="text-2xl" />
      </button>

      <button
        className={`flex flex-col items-center ${
          activeTab === "police" ? "text-green-500" : ""
        }`}
        onClick={() => setActiveTab("police")}
      >
        <FaShieldAlt className="text-2xl" />
      </button>

      <button
        className={`flex flex-col items-center ${
          activeTab === "policymakers" ? "text-green-500" : ""
        }`}
        onClick={() => setActiveTab("policymakers")}
      >
        <FaUserTie className="text-2xl" />
      </button>
    </nav>
  );
}
