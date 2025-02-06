"use client";

import React, { useState, useEffect } from 'react';
import { useWebSocketContext } from "../../../context/WebSocketContext";

const Reports = () => {
  const { validationResponse, error } = useWebSocketContext();
  const [displayData, setDisplayData] = useState(null);
  const CLEAR_TIMEOUT = 2 * 60 * 1000; // 2 minutes in milliseconds

  useEffect(() => {
    if (validationResponse) {
      // Set the new data
      setDisplayData(validationResponse);

      // Set a timer to clear the data after 2 minutes
      const timer = setTimeout(() => {
        setDisplayData(null);
      }, CLEAR_TIMEOUT);

      // Cleanup timer on component unmount or when new data arrives
      return () => clearTimeout(timer);
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

  const formattedData = formatData(displayData);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-xl text-center font-bold mb-4">Detected Vehicles</h1>
      
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
              <th className="p-3 text-left font-semibold border-b">Owner Name</th>
              <th className="p-3 text-left font-semibold border-b">Model</th>
              <th className="p-3 text-left font-semibold border-b">Reg No</th>
              <th className="p-3 text-left font-semibold border-b">PUC Status</th>
            </tr>
          </thead>
          <tbody>
            {formattedData.length > 0 ? (
              formattedData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 whitespace-normal break-words max-w-[200px]">{item.ownerName}</td>
                  <td className="p-3 whitespace-normal break-words max-w-[150px]">{item.model}</td>
                  <td className="p-3 whitespace-normal break-words max-w-[150px]">{item.regNo}</td>
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
                <td colSpan="4" className="p-3 text-center text-gray-500">
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