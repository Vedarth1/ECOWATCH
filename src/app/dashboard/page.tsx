'use client'
import React, { useState, useEffect, useCallback } from "react";
import CounterCard from "./components/counterCard";
import AirQualityChart from "./components/airQualityChart";
import PollutionCard from "./components/pollutioncard";
import { useWebSocketContext } from "../../context/WebSocketContext";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    valid: 0,
    invalid: 0,
    total: 0,
    unmatched: 0
  });

  const { validationResponse } = useWebSocketContext();

  const updateCounts = useCallback((result: { vehicle_pucc_details: { pucc_upto: string | number | Date; }; }) => {
    setCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      newCounts.total += 1;

      if (result.vehicle_pucc_details && result.vehicle_pucc_details.pucc_upto) {
        const puccValidUntil = new Date(result.vehicle_pucc_details.pucc_upto);
        const currentDate = new Date();
        
        if (puccValidUntil > currentDate) {
          newCounts.valid += 1;
        } else {
          newCounts.invalid += 1;
        }
      } else {
        newCounts.unmatched += 1;
      }

      return newCounts;
    });
  }, []);

  useEffect(() => {
    if (validationResponse && validationResponse.response) {
      validationResponse.response.forEach(updateCounts);
    }
  }, [validationResponse, updateCounts]);

  // Function to divide counts by 2 and round down to ensure integer values
  const getAdjustedCount = (count: number) => Math.floor(count / 2);

  const pollutants = [
    { ppmValue: 25.4, pollutantName: "Carbon Monoxide (CO)" },
  ];

  return (
    <div className="bg-black min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-6">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <CounterCard count={getAdjustedCount(counts.valid)} name="Valid" />
        <CounterCard count={getAdjustedCount(counts.invalid)} name="Invalid" />
        <CounterCard count={getAdjustedCount(counts.total)} name="Total" />
        <CounterCard count={getAdjustedCount(counts.unmatched)} name="Unmatched" />
      </div>

      <div className="mt-8">
        <AirQualityChart />
      </div>

      <div className="mt-8">
        <h2 className="text-lg text-center font-semibold text-white mb-4">Current Pollution Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pollutants.map((pollutant, index) => (
            <PollutionCard
              key={index}
              ppmValue={pollutant.ppmValue}
              pollutantName={pollutant.pollutantName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;