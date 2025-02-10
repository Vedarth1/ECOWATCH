
// components/PollutionMonitorCard.jsx
import React, { useEffect, useState } from 'react';
import { useWebSocketContext } from '../../context/WebSocketContext';
import { useRegion } from '../../context/regionContext';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { savePpmData } from '../utils/pollutionApi';
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast for notifications

const PollutionMonitorCard = () => {
  const { pollutionData, isConnected } = useWebSocketContext();
  const { regionData } = useRegion();
  const [lastSavedPpm, setLastSavedPpm] = useState(null);

  useEffect(() => {
    const savePpmValue = async () => {
      // Only save if we have new PPM data, a region, and the value has changed
      if (
        pollutionData?.ppm && 
        regionData?.regionName && 
        lastSavedPpm !== pollutionData.ppm
      ) {
        try {
          await savePpmData(regionData.regionName, pollutionData.ppm);
          setLastSavedPpm(pollutionData.ppm);
          toast.success('PPM data saved successfully');
        } catch (error) {
          toast.error('Failed to save PPM data');
          console.error('Failed to save PPM data:', error);
        }
      }
    };

    savePpmValue();
  }, [pollutionData?.ppm, regionData?.regionName, lastSavedPpm]);

  // Function to determine color based on PPM level
  const getPpmColor = (ppm) => {
    if (!ppm) return 'text-gray-400';
    if (ppm <= 50) return 'text-green-400';
    if (ppm <= 100) return 'text-yellow-400';
    if (ppm <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  // Function to get air quality status based on PPM
  const getAirQualityStatus = (ppm) => {
    if (!ppm) return 'Unknown';
    if (ppm <= 50) return 'Good';
    if (ppm <= 100) return 'Moderate';
    if (ppm <= 150) return 'Unhealthy for Sensitive Groups';
    return 'Unhealthy';
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  if (!regionData) {
    return (
      <div className="max-w-sm p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
        <p className="text-gray-400 text-center">Please select a region to monitor pollution data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
      {/* Header with connection status and region info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">Air Quality Monitor</h3>
          <p className="text-sm text-gray-400">
            Region: {regionData.regionName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="h-5 w-5 text-green-400" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-400" />
          )}
          <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-4">
        {/* PPM Value */}
        <div className="text-center">
          <span className={`text-4xl font-bold ${getPpmColor(pollutionData?.ppm)}`}>
            {pollutionData?.ppm?.toFixed(1) || '0.0'}
          </span>
          <span className="text-gray-400 ml-2">PPM</span>
        </div>

        {/* Air Quality Status */}
        <div className="text-center">
          <span className="text-gray-400">Air Quality:</span>
          <span className={`ml-2 font-medium ${getPpmColor(pollutionData?.ppm)}`}>
            {getAirQualityStatus(pollutionData?.ppm)}
          </span>
        </div>

        {/* Alert if present */}
        {pollutionData?.alert && (
          <div className="flex items-center gap-2 p-3 bg-red-900/50 rounded-lg border border-red-700">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-sm text-red-200">{pollutionData.alert.message}</span>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
          <div>Device ID:</div>
          <div className="text-right">{pollutionData?.deviceId || 'N/A'}</div>
          
          <div>Last Updated:</div>
          <div className="text-right">{formatTimestamp(pollutionData?.timestamp)}</div>
          
          <div>Region:</div>
          <div className="text-right">{regionData.regionName}</div>
          
          <div>Last Saved PPM:</div>
          <div className="text-right">{lastSavedPpm?.toFixed(1) || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default PollutionMonitorCard;