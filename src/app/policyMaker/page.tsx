"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Counts from './components/counts';
import PollutionMonitorCard from '@/components/ui/pollutionCard';
import { useWebSocketContext } from '@/context/WebSocketContext';
import AirQualityChart from './components/airQuality';
import SearchableMap from './components/mapApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { AlertTriangle, Activity } from 'lucide-react';

const PolicyMaker = () => {
  const router = useRouter();
  const [vehicleCounts, setVehicleCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  try {
    const context = useWebSocketContext();
  } catch (error) {
    console.error("WebSocket Context Error:", error);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const vehicleResponse = await fetch('http://localhost:8000/api/vehicle-count');

        if (!vehicleResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const vehicleData = await vehicleResponse.json();

        // Process vehicle counts
        if (!vehicleData.data || !Array.isArray(vehicleData.data)) {
          throw new Error('Invalid vehicle data format received');
        }
        const formattedData = vehicleData.data.map(item => ({
          count: parseInt(item.count) || 0,
          name: item.name || 'Unknown'
        }));
        setVehicleCounts(formattedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Static cards data
  const staticCards = [
    { name: 'Public Vehicle', count: 0 },
    { name: 'Authority Vehicle', count: 0 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center !bg-black">
        <div className="text-white text-lg font-medium flex items-center">
          <Activity className="w-5 h-5 mr-2 animate-pulse" />
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center !bg-black">
        <Card className="w-full max-w-md !bg-black border border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{error}</p>
            <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
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
      <div className="min-h-screen flex items-center justify-center !bg-black">
        <Card className="w-full max-w-md !bg-black border border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              No Data Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">No vehicle data is currently available. Please try again later.</p>
            <Button className="mt-4 bg-yellow-600 hover:bg-yellow-700" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto !bg-black min-h-screen">
      <Card className="!bg-black border border-gray-800 shadow-xl mb-8">
        <CardHeader className="border-b border-gray-800 pb-4">
          <CardTitle className="text-white text-xl font-bold flex items-center">
            <Activity className="w-6 h-6 mr-3 text-red-500" />
            Invalid PUC Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCards.map((metric, index) => (
              <div key={index} className="w-full transform transition-transform hover:scale-105">
                <Counts count={metric.count} name={metric.name} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="!bg-black border border-gray-800 shadow-lg overflow-hidden h-full">
            <CardHeader className="!bg-black/90 border-b border-gray-800">
              <CardTitle className="text-lg font-medium text-white">Pollution Monitor</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 h-full">
                <PollutionMonitorCard />
              </div>
            </CardContent>
          </Card>
          
          <Card className="!bg-black border border-gray-800 shadow-lg overflow-hidden h-full">
            <CardHeader className="!bg-black/90 border-b border-gray-800">
              <CardTitle className="text-lg font-medium text-white">Air Quality Trends</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 h-full">
                <AirQualityChart />
              </div>
            </CardContent>
          </Card>
        </div>
          
        {/* Problem Regions Button - Enhanced styling */}
        <div className="flex justify-center my-10">
          <Button 
            onClick={() => router.push('/problem-regions')}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
            size="lg"
          >
            <AlertTriangle className="w-5 h-5 mr-3" />
            View Problem Regions
          </Button>
        </div>
          
        <Card className="!bg-black border border-gray-800 shadow-lg overflow-hidden mb-8">
          <CardHeader className="!bg-black/90 border-b border-gray-800">
            <CardTitle className="text-lg font-medium text-white">Active Regions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] w-full">
              <SearchableMap />
            </div>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error("Render Error:", error);
    return (
      <Card className="!bg-black border border-red-500/30 p-4 my-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-medium mb-1">Component Error</h3>
            <p className="text-red-300 text-sm">There was a problem loading this section. Please try refreshing the page.</p>
          </div>
        </div>
      </Card>
    );
  }
};

export default PolicyMaker;