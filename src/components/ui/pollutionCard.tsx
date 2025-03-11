import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useWebSocketContext } from '../../context/WebSocketContext';
import { useRegion } from '../../context/regionContext';
import { AlertCircle, Wifi, WifiOff, MapPin } from 'lucide-react';
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
  },
  info: (message, data = {}) => {
    console.info(`[PollutionMonitor][INFO][${new Date().toISOString()}] ${message}`, data);
  }
};

// Function to fetch coordinates from Google Geocoding API
const fetchCoordinates = async (regionName, city, state) => {
  const address = `${regionName}, ${city}, ${state}`;
  const apiKey = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error(`Geocoding failed: ${data.status}`);
    }
  } catch (error) {
    logger.error('Failed to fetch coordinates', error, { address });
    throw error;
  }
};

// Function to fetch air quality data from our Node.js backend API
const fetchAirQualityData = async (lat, lng) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'; // Adjust to your backend URL
  const url = `${backendUrl}/air-quality?lat=${lat}&lng=${lng}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(`Air Quality API error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    logger.error('Failed to fetch air quality data', error, { lat, lng });
    throw error;
  }
};

const PollutionMonitorCard = () => {
  const { pollutionData, isConnected } = useWebSocketContext();
  const { regionData } = useRegion();
  const [lastProcessedData, setLastProcessedData] = useState(null);
  const [processingError, setProcessingError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const retryTimeoutRef = useRef(null);

  // Process PPM data with retry logic
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

  // Fetch coordinates and air quality data when region changes
  useEffect(() => {
    const fetchData = async () => {
      if (!regionData || !regionData.regionName || !regionData.city || !regionData.state) {
        return;
      }
      
      setApiLoading(true);
      try {
        // Get coordinates from Geocoding API
        const coords = await fetchCoordinates(
          regionData.regionName,
          regionData.city,
          regionData.state
        );
        setCoordinates(coords);
        
        // Get air quality data from Air Quality API
        const aqData = await fetchAirQualityData(coords.lat, coords.lng);
        setAirQualityData(aqData);
        logger.info('Air quality data fetched successfully', { coords, data: aqData });
      } catch (error) {
        logger.error('Failed to fetch API data', error);
        setProcessingError('Failed to fetch location or air quality data');
      } finally {
        setApiLoading(false);
      }
    };
    
    fetchData();
  }, [regionData]);

  // Process WebSocket pollution data
  useEffect(() => {
    // Check if we have valid data to process
    const isValidPpm = pollutionData && typeof pollutionData.ppm === 'number';
    const isValidRegion = regionData && regionData.regionName;

    if (isValidPpm && isValidRegion) {
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
        hasPpm: isValidPpm,
        ppmValue: pollutionData?.ppm,
        hasRegionName: isValidRegion
      });
    }
  }, [pollutionData, regionData, processWithRetry]); 

  // Cleanup on unmount
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

  const getAirQualityStatus = useCallback((index) => {
    if (!index) return 'Unknown';
    
    // Based on Universal AQI (UAQI) index
    if (index <= 25) return 'Good';
    if (index <= 50) return 'Fair';
    if (index <= 75) return 'Moderate';
    if (index <= 100) return 'Poor';
    return 'Very Poor';
  }, []);

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return 'N/A';
    return new Intl.DateTimeFormat('default', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    }).format(new Date(timestamp));
  }, []);

  // Extract relevant air quality metrics from API response
  const getAirQualityMetrics = useCallback(() => {
    if (!airQualityData || !airQualityData.indexes || airQualityData.indexes.length === 0) {
      return null;
    }

    const uaqi = airQualityData.indexes.find(index => index.code === 'uaqi');
    
    return {
      aqi: uaqi ? uaqi.aqi : null,
      aqiDisplay: uaqi ? uaqi.aqiDisplay : null,
      aqiCategory: uaqi ? uaqi.category : null,
      dominantPollutant: uaqi ? uaqi.dominantPollutant : null,
      dateTime: airQualityData.dateTime,
      regionCode: airQualityData.regionCode
    };
  }, [airQualityData]);

  const getAqiColor = useCallback((aqi) => {
    if (!aqi) return 'text-gray-500';
    if (aqi <= 25) return 'text-green-400';
    if (aqi <= 50) return 'text-green-300';
    if (aqi <= 75) return 'text-yellow-400';
    if (aqi <= 100) return 'text-orange-400';
    return 'text-red-400';
  }, []);

  if (!regionData) {
    return (
      <Card className="max-w-sm !bg-black border-gray-700">
        <CardHeader className="!bg-black">
          <CardTitle className="!text-white">Air Quality Monitor</CardTitle>
        </CardHeader>
        <CardContent className="!bg-black !text-white">
          <p>No region selected. Please select a region first.</p>
        </CardContent>
      </Card>
    );
  }

  const airQualityMetrics = getAirQualityMetrics();

  return (
    <Card className="max-w-sm !bg-black border-gray-700">
      <CardHeader className="pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-300">
              Region: {regionData.regionName}, {regionData.city}, {regionData.state}
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

        {coordinates && (
          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</span>
          </div>
        )}

        {processingError && (
          <Alert variant="destructive" className="bg-red-900/30 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              {processingError}
            </AlertDescription>
          </Alert>
        )}

        {airQualityMetrics && (
          <div className="bg-gray-800/50 rounded-md p-3 text-sm">
            <h3 className="text-gray-200 font-medium mb-2">External Air Quality Data</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-300">Universal AQI:</div>
              <div className={`text-right font-medium ${getAqiColor(airQualityMetrics.aqi)}`}>
                {airQualityMetrics.aqiDisplay || 'N/A'}
              </div>
              
              <div className="text-gray-300">Category:</div>
              <div className="text-right text-gray-200">{airQualityMetrics.aqiCategory || 'N/A'}</div>
              
              <div className="text-gray-300">Main Pollutant:</div>
              <div className="text-right text-gray-200">
                {airQualityMetrics.dominantPollutant ? airQualityMetrics.dominantPollutant.toUpperCase() : 'N/A'}
              </div>
              
              <div className="text-gray-300">Region Code:</div>
              <div className="text-right text-gray-200">
                {airQualityMetrics.regionCode ? airQualityMetrics.regionCode.toUpperCase() : 'N/A'}
              </div>
              
              <div className="text-gray-300">Data Time:</div>
              <div className="text-right text-gray-200">
                {airQualityMetrics.dateTime ? formatTimestamp(airQualityMetrics.dateTime) : 'N/A'}
              </div>
            </div>
          </div>
        )}

        {apiLoading && (
          <div className="text-center text-sm text-gray-400">
            Loading air quality data...
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm border-t border-gray-700 pt-4">
          <div className="text-gray-300">Device ID:</div>
          <div className="text-right text-gray-200">{pollutionData?.deviceId || 'N/A'}</div>
          
          <div className="text-gray-300">Last Updated:</div>
          <div className="text-right text-gray-200">{formatTimestamp(pollutionData?.timestamp)}</div>
          
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