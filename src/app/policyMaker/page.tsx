"use client";

import React, { useState, useEffect } from 'react';
import Counts from './components/counts';
import PollutionMonitorCard from '@/components/ui/pollutionCard';
import { useWebSocketContext } from '@/context/WebSocketContext';
import AirQualityChart from './components/airQuality';

const PolicyMaker = () => {
  const [vehicleCounts, setVehicleCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try to use the context here to debug
  try {
    const context = useWebSocketContext();
  } catch (error) {
    console.error("WebSocket Context Error:", error);
  }

  useEffect(() => {
    const fetchVehicleCounts = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch('http://localhost:8000/api/vehicle-count');
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle counts');
        }
        const data = await response.json(); // Debug log

        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid data format received');
        }

        // Ensure data has the correct structure
        const formattedData = data.data.map(item => ({
          count: parseInt(item.count) || 0,
          name: item.name || 'Unknown'
        })); // Debug log
        setVehicleCounts(formattedData);
      } catch (err) {
        console.error('Error fetching vehicle counts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleCounts();
  }, []);

  // Debug render

  if (loading) {
    return (
      <div className="px-6">
        <div className="text-white text-xl text-center font-semibold">
          Loading vehicle counts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6">
        <div className="text-red-500 text-xl text-center font-semibold">
          Error: {error}
        </div>
      </div>
    );
  }

  // Add check for empty data
  if (!vehicleCounts || vehicleCounts.length === 0) {
    return (
      <div className="px-6">
        <div className="text-white text-xl text-center font-semibold">
          No vehicle data available
        </div>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="space-y-6">
        <div className="text-white text-xl text-center font-semibold">
          Invalid PUC
        </div>
        <div className="grid grid-cols-3 gap-4">
          {vehicleCounts.map((metric, index) => {// Debug log
            return (
              <Counts
                key={index}
                count={metric.count}
                name={metric.name}
              />
            );
          })}
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