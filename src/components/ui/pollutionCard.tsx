// components/PollutionMonitorCard.tsx

import React from 'react';
import { useWebSocketContext } from '../../context/WebSocketContext';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { PollutionData } from '../../types/pollution';

const PollutionMonitorCard: React.FC = () => {
  const { pollutionData, isConnected } = useWebSocketContext();

  // Function to determine color based on PPM level
  const getPpmColor = (ppm: number): string => {
    if (ppm <= 50) return 'text-green-400';
    if (ppm <= 100) return 'text-yellow-400';
    if (ppm <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-sm p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
      {/* Header with connection status */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Air Quality Monitor</h3>
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
          <span className={`text-4xl font-bold ${getPpmColor(pollutionData?.ppm || 0)}`}>
            {pollutionData?.ppm?.toFixed(1) || '0.0'}
          </span>
          <span className="text-gray-400 ml-2">PPM</span>
        </div>

        {/* Air Quality Status */}
        <div className="text-center">
          <span className="text-gray-400">Air Quality:</span>
          <span className="ml-2 font-medium text-gray-200">
            {pollutionData?.airQuality || 'Unknown'}
          </span>
        </div>

        {/* Alert if present */}
        {pollutionData?.alert && (
          <div className="flex items-center gap-2 p-3 bg-red-900/50 rounded-lg border border-red-700">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-sm text-red-200">{pollutionData.alert.message}</span>
          </div>
        )}

        {/* Device Info */}
        <div className="text-sm text-gray-400">
          <div>Device ID: {pollutionData?.deviceId || 'N/A'}</div>
          <div>Last Updated: {pollutionData?.timestamp || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default PollutionMonitorCard;