"use client";

import React from 'react';
import Counts from './components/counts';
import PollutionMonitorCard from '@/components/ui/pollutionCard';
import { useWebSocketContext } from '@/context/WebSocketContext';
import AirQualityChart from './components/airQuality';

const PolicyMaker = () => {
  // Try to use the context here to debug
  try {
    const context = useWebSocketContext();
    console.log("WebSocket Context in PolicyMaker:", context);
  } catch (error) {
    console.error("WebSocket Context Error:", error);
  }

  const metrics = [
    {
      count: 12,
      name: "Two wheelers"
    },
    {
      count: 56,
      name: "Cars(LMV)"
    },
    {
      count: 89,
      name: "Public buses"
    }
  ];

  return (
    <div className="px-6">
      <div className="space-y-6">
        <div className="text-white text-xl text-center font-semibold">
          Invalid PUC
        </div>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <Counts
              key={index}
              count={metric.count}
              name={metric.name}
            />
          ))}
        </div>
        <br />
        <br />
        <ErrorBoundary>
          <PollutionMonitorCard/>
          <AirQualityChart/>
        </ErrorBoundary>
      </div>
    </div>
  );
};

// Simple Error Boundary Component
const ErrorBoundary = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error("Render Error:", error);
    return <div className="text-red-500">Error loading pollution monitor</div>;
  }
};

export default PolicyMaker;