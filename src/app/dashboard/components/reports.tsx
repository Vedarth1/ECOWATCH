"use client";

import React, { useState, useEffect } from 'react';
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { useRegion } from '../../../context/regionContext';

const Reports = () => {
  const { error: wsError } = useWebSocketContext();
  const { regionData } = useRegion();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Explicitly define error state type

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!regionData?.regionName) {
        setError('No region selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const encodedRegionName = encodeURIComponent(regionData.regionName);
        const response = await fetch(`http://43.204.97.229:8000/api/region/${encodedRegionName}/vehicles`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: 'Failed to fetch vehicle data'
          }));
          throw new Error(errorData.message || 'Failed to fetch vehicle data');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch vehicle data');
        }

        setVehicles(formatData(data));
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle data');
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    if (regionData?.regionName) {
      fetchVehicles();
    } else {
      setError('No region selected');
      setLoading(false);
    }
  }, [regionData?.regionName]);

  const formatData = (response) => {
    if (!response?.response) return [];
    
    return response.response.map(item => ({
      ownerName: item.owner_name,
      model: item.model,
      regNo: item.reg_no,
      pucStatus: new Date(item.vehicle_pucc_details.pucc_upto) > new Date() ? 'Valid' : 'Invalid',
      puccDetails: {
        validFrom: item.vehicle_pucc_details.pucc_from,
        validUntil: item.vehicle_pucc_details.pucc_upto,
        centerNo: item.vehicle_pucc_details.pucc_centreno,
        puccNo: item.vehicle_pucc_details.pucc_no
      }
    }));
  };

  const handleRefresh = () => {
    if (regionData?.regionName) {
      // We need to recreate the fetch function since it's now inside the useEffect
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          const encodedRegionName = encodeURIComponent(regionData.regionName);
          const response = await fetch(`http://43.204.97.229:8000/api/region/${encodedRegionName}/vehicles`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({
              message: 'Failed to fetch vehicle data'
            }));
            throw new Error(errorData.message || 'Failed to fetch vehicle data');
          }

          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.message || 'Failed to fetch vehicle data');
          }

          setVehicles(formatData(data));
        } catch (err) {
          console.error('Error fetching vehicles:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch vehicle data');
          setVehicles([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  };

  if (!regionData?.regionName) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center text-white">
        Please select a region to view vehicle reports.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Detected Vehicles</h1>
          <p className="text-gray-400 text-sm mt-1">
            Region: {regionData.regionName} | City: {regionData.city} | State: {regionData.state}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm ${
            loading 
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-gray-900 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {(error || wsError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error || wsError}</p>
        </div>
      )}

      <div className="bg-black rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-950">
              <th className="p-3 text-left font-semibold border-b text-white">Owner Name</th>
              <th className="p-3 text-left font-semibold border-b text-white">Model</th>
              <th className="p-3 text-left font-semibold border-b text-white">Reg No</th>
              <th className="p-3 text-left font-semibold border-b text-white">PUC Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : vehicles.length > 0 ? (
              vehicles.map((item, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-900">
                  <td className="p-3 whitespace-normal break-words max-w-[200px] text-white">{item.ownerName}</td>
                  <td className="p-3 whitespace-normal break-words max-w-[150px] text-white">{item.model}</td>
                  <td className="p-3 whitespace-normal break-words max-w-[150px] text-white">{item.regNo}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.pucStatus === 'Valid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.pucStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-400">
                  No vehicles detected yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;