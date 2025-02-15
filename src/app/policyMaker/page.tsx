"use client";
import React, { useState, useEffect } from 'react';
import Counts from './components/counts';
import PollutionMonitorCard from '@/components/ui/pollutionCard';
import { useWebSocketContext } from '@/context/WebSocketContext';
import AirQualityChart from './components/airQuality';
import SearchableMap from './components/mapApi';

const PolicyMaker = () => {
  const [vehicleCounts, setVehicleCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const data = await response.json();
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid data format received');
        }
        const formattedData = data.data.map(item => ({
          count: parseInt(item.count) || 0,
          name: item.name || 'Unknown'
        }));
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

  // Static cards data
  const staticCards = [
    { name: 'Public Vehicle', count: 0 },
    { name: 'Authority Vehicle', count: 0 }
  ];

  if (loading) {
    return (
      <div className="px-4 max-w-6xl mx-auto">
        <div className="text-white text-base text-center font-semibold">
          Loading vehicle counts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 max-w-6xl mx-auto">
        <div className="text-red-500 text-base text-center font-semibold">
          Error: {error}
        </div>
      </div>
    );
  }

  // Combine dynamic and static cards
  const allCards = [
    ...(vehicleCounts || []),
    ...staticCards
  ];

  if (!allCards || allCards.length === 0) {
    return (
      <div className="px-4 max-w-6xl mx-auto">
        <div className="text-white text-base text-center font-semibold">
          No vehicle data available
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <div className="space-y-4">
        <div className="text-white text-lg text-center font-semibold">
          Invalid PUC
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {allCards.map((metric, index) => (
            <div key={index} className="w-full">
              <Counts
                count={metric.count}
                name={metric.name}
              />
            </div>
          ))}
        </div>
        <br />
        <br />
        <ErrorBoundary>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="w-full max-w-lg mx-auto lg:max-w-md">
              <PollutionMonitorCard />
            </div>
            <div className="w-full max-w-lg mx-auto lg:max-w-md h-[400px]">
              <AirQualityChart />
            </div>
            
          </div>
              <SearchableMap/>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error("Render Error:", error);
    return <div className="text-red-500 text-sm">Error loading pollution monitor</div>;
  }
};

export default PolicyMaker;