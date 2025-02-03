// pages/dashboard.tsx
'use client'

import React, { useEffect } from "react";
import CounterCard from "./components/counterCard";
import { useRegion } from "../../context/regionContext";
import { useRegionStats } from "../../hooks/useRegionStats";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { RegionStats } from "../../types/regionStats";
import PollutionMonitorCard from "@/components/ui/pollutionCard";

const Dashboard = () => {
    const { regionData } = useRegion();
    const { validationResponse } = useWebSocketContext();
    const { 
        regionStats, 
        loading, 
        error, 
        refetch 
    } = useRegionStats(regionData?.regionName);

    useEffect(() => {
        if (validationResponse) {
            refetch();
        }
    }, [validationResponse, refetch]);

    if (loading) {
        return (
            <div className="bg-black min-h-screen p-4 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-black min-h-screen p-4 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!regionData?.regionName || !regionStats) {
        return (
            <div className="bg-black min-h-screen p-4 flex items-center justify-center">
                <div className="text-white">Please select a region first</div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen p-4">
            <div className="text-center">
                <h1 className="text-xl font-bold text-white mb-2">
                    {regionStats.region_name} Dashboard
                </h1>
                <p className="text-gray-400 text-sm mb-6">
                    {regionStats.city}, {regionStats.state}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <CounterCard 
                    count={regionStats.valid_count} 
                    name="Valid" 
                />
                <CounterCard 
                    count={regionStats.invalid_count} 
                    name="Invalid" 
                />
                <CounterCard 
                    count={regionStats.total_count} 
                    name="Total" 
                />
                <CounterCard 
                    count={regionStats.unmatched_count || 0} 
                    name="Unmatched" 
                />
            </div>
            <div className="flex justify-center items-center w-full">
            <PollutionMonitorCard/>
            </div>
        </div>
        
    );
};

export default Dashboard;