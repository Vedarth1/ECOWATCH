"use client";

import React, { useState, useEffect } from 'react';
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { Download } from "lucide-react";

const Reports = () => {
  const { validationResponse, error } = useWebSocketContext();
  const [displayData, setDisplayData] = useState(null);
  const STORAGE_KEY = 'vehicle_reports_data';
  const EXPIRY_KEY = 'vehicle_reports_expiry';
  const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  useEffect(() => {
    // Check for existing data in localStorage on component mount
    const loadStoredData = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        const expiryTime = localStorage.getItem(EXPIRY_KEY);
        
        if (storedData && expiryTime) {
          const now = new Date().getTime();
          if (now < parseInt(expiryTime)) {
            setDisplayData(JSON.parse(storedData));
          } else {
            // Clear expired data
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(EXPIRY_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, [STORAGE_KEY, EXPIRY_KEY, EXPIRY_TIME]); // Added EXPIRY_TIME to dependency array

  useEffect(() => {
    if (validationResponse) {
      // Update state
      setDisplayData(validationResponse);

      try {
        // Store in localStorage with expiry
        const expiryTime = new Date().getTime() + EXPIRY_TIME;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validationResponse));
        localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
      } catch (error) {
        console.error('Error storing data:', error);
      }
    }
  }, [validationResponse, STORAGE_KEY, EXPIRY_KEY, EXPIRY_TIME]); // Added EXPIRY_TIME to dependency array

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

  const exportToCSV = () => {
    if (formattedData.length === 0) return;

    // Create CSV headers
    const headers = [
      'Owner Name',
      'Model',
      'Registration Number',
      'PUC Status',
      'PUC Valid From',
      'PUC Valid Until',
      'PUC Center Number',
      'PUC Number'
    ];

    // Convert data to CSV format
    const csvData = formattedData.map(item => [
      item.ownerName,
      item.model,
      item.regNo,
      item.pucStatus,
      item.puccDetails.validFrom,
      item.puccDetails.validUntil,
      item.puccDetails.centerNo,
      item.puccDetails.puccNo
    ]);

    // Add headers to the beginning
    csvData.unshift(headers);

    // Convert to CSV string
    const csvString = csvData
      .map(row => 
        row.map(cell => 
          typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
        ).join(',')
      )
      .join('\n');

    // Create and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `vehicle_reports_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearStoredData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      setDisplayData(null);
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Detected Vehicles</h1>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            disabled={formattedData.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              ${formattedData.length === 0 
                ? 'bg-black cursor-not-allowed' 
                : 'bg-gray-900 hover:bg-blue-700 text-white'}`}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>
      
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