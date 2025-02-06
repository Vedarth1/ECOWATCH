"use client";

import React, { useState, useEffect } from 'react';
import { useWebSocketContext } from "../../../context/WebSocketContext";

const Reports = () => {
  const { validationResponse, error } = useWebSocketContext();
  const [storedData, setStoredData] = useState(null);
  const STORAGE_KEY = 'vehicle_reports';

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setStoredData(JSON.parse(savedData));
    }
  }, []);

  // Handle new WebSocket data
  useEffect(() => {
    if (validationResponse) {
      setStoredData(validationResponse);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validationResponse));
    }
  }, [validationResponse]);

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

  const formattedData = formatData(storedData);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-xl text-center font-bold mb-4 text-white">Detected Vehicles</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
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
            {formattedData.length > 0 ? (
              formattedData.map((item, index) => (
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