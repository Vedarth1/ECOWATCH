'use client'
import React from "react";
import CounterCard from "./components/counterCard";
import AirQualityChart from "./components/airQualityChart";

const Dashboard = () => {
  return (
    <div className="bg-black min-h-screen p-4">
      {/* Center-aligned heading */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-6">Dashboard</h1>
      </div>

      {/* CounterCard grid */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <CounterCard stepsCount={9592} averageSteps={6967} />
        <CounterCard stepsCount={8500} averageSteps={7500} />
        <CounterCard stepsCount={12345} averageSteps={8900} />
        <CounterCard stepsCount={10000} averageSteps={9000} />
      </div>

      {/* AirQualityChart section */}
      <div className="mt-8">
        <AirQualityChart />
      </div>
    </div>
  );
};

export default Dashboard;
