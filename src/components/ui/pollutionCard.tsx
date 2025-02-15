import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useWebSocketContext } from '../../context/WebSocketContext';
import { useRegion } from '../../context/regionContext';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { savePpmData } from '../utils/pollutionApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RETRY_DELAY = 5000;
const MAX_RETRIES = 3;

const logger = {
  error: (message, error, data = {}) => {
    console.error(`[PollutionMonitor][ERROR][${new Date().toISOString()}] ${message}`, { error, ...data });
  },
  warn: (message, data = {}) => {
    console.warn(`[PollutionMonitor][WARN][${new Date().toISOString()}] ${message}`, data);
  }
};

const PollutionMonitorCard = () => {
  const { pollutionData, isConnected } = useWebSocketContext();
  const { regionData } = useRegion();
  const [lastProcessedData, setLastProcessedData] = useState(null);
  const [processingError, setProcessingError] = useState(null);
  const retryTimeoutRef = useRef(null);

  // Rest of the hooks and callbacks remain the same...
  const processWithRetry = useCallback(async (regionName, ppm, timestamp, retryCount = 0) => {
    try {
      await savePpmData(regionName, ppm);
      setLastProcessedData({ ppm, timestamp });
      setProcessingError(null);
    } catch (error) {
      logger.error('Failed to process pollution data', error, {
        ppm,
        region: regionName,
        retryCount,
        errorMessage: error.message
      });

      if (retryCount < MAX_RETRIES) {
        retryTimeoutRef.current = setTimeout(() => {
          processWithRetry(regionName, ppm, timestamp, retryCount + 1);
        }, RETRY_DELAY);
      } else {
        setProcessingError(`Failed to save data after ${MAX_RETRIES} attempts`);
      }
    }
  }, []);

  useEffect(() => {
    if (pollutionData && typeof pollutionData.ppm === 'number' && regionData?.regionName) {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      processWithRetry(
        regionData.regionName,
        pollutionData.ppm,
        pollutionData.timestamp
      );
    } else if (pollutionData || regionData) {
      logger.warn('Missing required data for processing', {
        hasPpm: typeof pollutionData?.ppm === 'number',
        ppmValue: pollutionData?.ppm,
        hasRegionName: !!regionData?.regionName
      });
    }
  }, [pollutionData, regionData?.regionName, processWithRetry]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const getPpmColor = useCallback((ppm) => {
    if (!ppm) return 'text-gray-500';
    if (ppm <= 50) return 'text-green-400';
    if (ppm <= 100) return 'text-yellow-400';
    if (ppm <= 150) return 'text-orange-400';
    return 'text-red-400';
  }, []);

  const getAirQualityStatus = useCallback((ppm) => {
    if (!ppm) return 'Unknown';
    if (ppm <= 50) return 'Good';
    if (ppm <= 100) return 'Moderate';
    if (ppm <= 150) return 'Unhealthy for Sensitive Groups';
    return 'Unhealthy';
  }, []);

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return 'N/A';
    return new Intl.DateTimeFormat('default', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    }).format(new Date(timestamp));
  }, []);

  if (!regionData) {
    return (
      <Card className="max-w-sm !bg-black border-gray-700">
        <CardHeader className="!bg-black">
          <CardTitle className="!text-white">Air Quality Monitor</CardTitle>
        </CardHeader>
        <CardContent className="!bg-black !text-white">
          <p>Test content</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-sm !bg-black border-gray-700">
      <CardHeader className="pt-6">
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-300">Region: {regionData.regionName}</p>
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
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div>
            <span className={`text-4xl font-bold ${getPpmColor(pollutionData?.ppm)}`}>
              {pollutionData?.ppm?.toFixed(1) || '0.0'}
            </span>
            <span className="text-gray-300 ml-2">PPM</span>
          </div>
          <div>
            <span className="text-gray-300">Air Quality:</span>
            <span className={`ml-2 font-medium ${getPpmColor(pollutionData?.ppm)}`}>
              {getAirQualityStatus(pollutionData?.ppm)}
            </span>
          </div>
        </div>

        {processingError && (
          <Alert variant="destructive" className="bg-red-900/30 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              {processingError}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm border-t border-gray-700 pt-4">
          <div className="text-gray-300">Device ID:</div>
          <div className="text-right text-gray-200">{pollutionData?.deviceId || 'N/A'}</div>
          
          <div className="text-gray-300">Last Updated:</div>
          <div className="text-right text-gray-200">{formatTimestamp(pollutionData?.timestamp)}</div>
          
          <div className="text-gray-300">Region:</div>
          <div className="text-right text-gray-200">{regionData.regionName}</div>
          
          <div className="text-gray-300">Last Processed:</div>
          <div className="text-right text-gray-200">
            {lastProcessedData ? formatTimestamp(lastProcessedData.timestamp) : 'N/A'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutionMonitorCard;