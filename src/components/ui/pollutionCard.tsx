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
    if (!ppm) return 'text-gray-400';
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
      <Card className="max-w-sm bg-black border border-gray-800">
        <CardContent className="pt-6">
          <p className="text-gray-400 text-center">Please select a region to monitor pollution data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-sm bg-black border border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg text-white">Air Quality Monitor</CardTitle>
          <p className="text-sm text-gray-400">Region: {regionData.regionName}</p>
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
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div>
            <span className={`text-4xl font-bold ${getPpmColor(pollutionData?.ppm)}`}>
              {pollutionData?.ppm?.toFixed(1) || '0.0'}
            </span>
            <span className="text-gray-400 ml-2">PPM</span>
          </div>
          <div>
            <span className="text-gray-400">Air Quality:</span>
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

        <div className="grid grid-cols-2 gap-2 text-sm border-t border-gray-800 pt-4">
          <div className="text-gray-400">Device ID:</div>
          <div className="text-right text-gray-300">{pollutionData?.deviceId || 'N/A'}</div>
          
          <div className="text-gray-400">Last Updated:</div>
          <div className="text-right text-gray-300">{formatTimestamp(pollutionData?.timestamp)}</div>
          
          <div className="text-gray-400">Region:</div>
          <div className="text-right text-gray-300">{regionData.regionName}</div>
          
          <div className="text-gray-400">Last Processed:</div>
          <div className="text-right text-gray-300">
            {lastProcessedData ? formatTimestamp(lastProcessedData.timestamp) : 'N/A'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutionMonitorCard;