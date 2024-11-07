import React from 'react';
import useSensorSocket from '@/hooks/useSensorSocket';
import { AlertCircle, Loader } from 'lucide-react';

const PollutionCard = () => {
  const { 
    sensorData, 
    isConnected, 
    error, 
    connectionStatus 
  } = useSensorSocket();

  // Function to determine status color
  const getStatusColor = () => {
    if (!sensorData) return 'bg-gray-400';
    const ppm = sensorData.ppm;
    if (ppm < 50) return 'bg-green-400';
    if (ppm < 100) return 'bg-yellow-400';
    if (ppm < 150) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Function to get status message
  const getStatusMessage = () => {
    if (!sensorData) return 'No data';
    const ppm = sensorData.ppm;
    if (ppm < 50) return 'Good';
    if (ppm < 100) return 'Moderate';
    if (ppm < 150) return 'Unhealthy';
    return 'Dangerous';
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-full relative overflow-hidden flex flex-col items-center justify-center min-h-[100px]">
      {/* Connection Status Indicator */}
      <div className={`absolute top-2 right-2 flex items-center gap-2 text-xs ${
        connectionStatus === 'connected' ? 'text-green-400' :
        connectionStatus === 'connecting' ? 'text-yellow-400' :
        'text-red-400'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected' ? 'bg-green-400' :
          connectionStatus === 'connecting' ? 'bg-yellow-400' :
          'bg-red-400'
        }`} />
        {connectionStatus}
      </div>

      <div className="relative z-10 text-center">
        {error ? (
          <div className="flex flex-col items-center gap-2 text-red-400">
            <AlertCircle size={24} />
            <div className="text-sm">Error connecting to sensor</div>
          </div>
        ) : !isConnected ? (
          <div className="flex flex-col items-center gap-2">
            <Loader className="animate-spin" size={24} />
            <div className="text-gray-400">
              Connecting to sensor...
            </div>
          </div>
        ) : !sensorData ? (
          <div className="animate-pulse text-gray-400">
            Waiting for data...
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold mb-1">
              {sensorData.ppm.toFixed(1)} PPM
            </div>
            <div className="text-sm text-gray-400">
              Gas Concentration
            </div>
            <div className="text-xs mt-2">
              RS/R0 Ratio: {sensorData.rs_ro_ratio.toFixed(3)}
            </div>
            <div className={`text-xs mt-2 ${
              sensorData.ppm < 50 ? 'text-green-400' :
              sensorData.ppm < 100 ? 'text-yellow-400' :
              sensorData.ppm < 150 ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {getStatusMessage()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(sensorData.timestamp).toLocaleTimeString()}
            </div>
          </>
        )}
      </div>

      {/* Status Bar */}
      <div className={`absolute right-0 top-0 bottom-0 w-1 transition-colors duration-300 ${getStatusColor()}`}></div>
      
      {/* Background Pulse Effect */}
      {isConnected && sensorData && (
        <div className={`absolute inset-0 ${getStatusColor()} opacity-5 transition-opacity duration-300`}>
          <div className="absolute inset-0 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default PollutionCard;