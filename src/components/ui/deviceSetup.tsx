import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Progress from '../ui/progress';

const API_BASE_URL = 'http://localhost:8000/api';
const AWS_API_URL = 'https://ng8br1qz4f.execute-api.ap-south-1.amazonaws.com/test';
const API_2_URL = 'https://8w0p1ti7p4.execute-api.ap-south-1.amazonaws.com/prod';

const DeviceSetup = ({ onComplete }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [selectedPort, setSelectedPort] = useState('');
  const [availablePorts, setAvailablePorts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashStatus, setFlashStatus] = useState({
    status: 'idle',
    message: '',
    progress: 0,
  });
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    verifyAuthHeaders();
    const fetchPorts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ports`);
        if (response.data.success) {
          setAvailablePorts(response.data.ports);
          if (response.data.ports.length > 0 && !selectedPort) {
            setSelectedPort(response.data.ports[0].path);
          }
        }
      } catch (error) {
        console.error('Error fetching ports:', error);
        setError('Failed to fetch available ports');
        setAvailablePorts([]);
      }
    };

    fetchPorts();
    const interval = setInterval(fetchPorts, 800000);
    return () => clearInterval(interval);
  }, [selectedPort]);

  const verifyAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token && !axios.defaults.headers.common['Authorization']) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const handleError = (error) => {
    console.error('Device setup error:', error);
    setFlashStatus({
      status: 'error',
      message: 'Setup failed',
      progress: 0
    });

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const serverMessage = error.response.data?.message || error.response.data?.error;
        setError(serverMessage || `Server error: ${error.response.status}`);
      } else if (error.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError('Failed to send request. Please try again.');
      }
    } else {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const handleSkip = () => {
    const skipDeviceId = `skipped-${Date.now()}`;
    onComplete?.({
      userId: `user-${Date.now()}`,
      deviceId: skipDeviceId,
      ssid: 'skipped'
    });
  };

  const handleDeviceRegistration = async () => {
    try {
      if (!ssid || !password) {
        setError('WiFi credentials are required');
        return;
      }
  
      setIsLoading(true);
      setError(null);
      
      const userId = `user-${Date.now()}`;
      const customDeviceId = `device-${Date.now()}`;
  
      setFlashStatus({
        status: 'preparing',
        message: 'Sending request to configure device...',
        progress: 30
      });
  
      // Initial request to start processing
      try {
        await axios.post(
          `${AWS_API_URL}/stepfunction`,
          {
            userId,
            deviceId: customDeviceId,
            ssid,
            password
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } catch (error) {
        if (error.response?.status === 504) {
          console.log('Gateway timeout received, continuing with status check...');
        } else {
          throw error;
        }
      }
  
      setFlashStatus({
        status: 'processing',
        message: 'Compiling firmware...',
        progress: 50
      });
  
      console.log('Waiting before checking status...');
      await new Promise(resolve => setTimeout(resolve, 90000));
  
      // Check status - Fixed to handle API Gateway response format
      try {
        const statusResponse = await axios.post(
          `${API_2_URL}/status`,
          {
            userId,
            deviceId: customDeviceId
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            timeout: 29000
          }
        );

        // Parse the nested response structure from API Gateway
        const responseBody = typeof statusResponse.data.body === 'string' 
          ? JSON.parse(statusResponse.data.body) 
          : statusResponse.data.body;

        console.log('Status response:', responseBody);

        if (responseBody?.status === 'PROCESSING') {
          setDeviceId(responseBody.deviceId);
          
          setFlashStatus({
            status: 'flashing',
            message: 'Processing firmware compilation...',
            progress: 70
          });

        } else if (responseBody?.status === 'COMPLETED' && responseBody?.firmwareUrl) {
          setDeviceId(responseBody.deviceId);
          
          setFlashStatus({
            status: 'flashing',
            message: 'Flashing device firmware...',
            progress: 70
          });
    
          // Flash the device - Fixed to match backend requirements
          console.log('Sending flash request with:', {
            firmwareUrl: responseBody.firmwareUrl,
            portPath: selectedPort
          });

          const flashResponse = await axios.post(`${API_BASE_URL}/flash`, {
            firmwareUrl: responseBody.firmwareUrl,
            portPath: selectedPort
          });
    
          if (flashResponse.data.success) {
            setFlashStatus({
              status: 'complete',
              message: 'Device setup complete!',
              progress: 100
            });
    
            onComplete?.({
              userId,
              deviceId: responseBody.deviceId,
              ssid
            });
          } else {
            throw new Error('Firmware flashing failed');
          }
        } else {
          throw new Error('Invalid status response');
        }
      } catch (error) {
        console.error('Status check error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Setup error:', error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-white text-center">
        Device Setup
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Device Port
          </label>
          <select
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            disabled={isLoading || availablePorts.length === 0}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a port</option>
            {availablePorts.map((port) => (
              <option key={port.path} value={port.path}>
                {port.friendlyName || `${port.path} (${port.manufacturer || 'Unknown'})`}
              </option>
            ))}
          </select>
          {availablePorts.length === 0 && (
            <p className="text-sm text-gray-400 mt-1">No compatible devices found</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            WiFi Network Name
          </label>
          <input
            type="text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter WiFi SSID"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            WiFi Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter WiFi Password"
            disabled={isLoading}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-900/50 border border-red-500">
            <AlertDescription className="text-sm text-red-500">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleDeviceRegistration}
            disabled={isLoading || authLoading || !ssid || !password || !selectedPort}
            className={`flex-1 py-2 px-4 rounded text-white transition-colors ${
              isLoading || authLoading || !ssid || !password || !selectedPort
                ? 'bg-blue-500/50 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Configuring Device...' : 'Configure Device'}
          </button>

          <button
            onClick={handleSkip}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Skip Setup
          </button>
        </div>

        {flashStatus.status !== 'idle' && (
          <div className="mt-4 p-4 bg-gray-800 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-sm ${
                  flashStatus.status === 'error'
                    ? 'text-red-500'
                    : flashStatus.status === 'complete'
                    ? 'text-green-500'
                    : 'text-blue-500'
                }`}
              >
                {flashStatus.status === 'complete' && '✓ '}
                {flashStatus.message}
              </p>
            </div>

            <Progress
              value={flashStatus.progress}
              className="h-2 bg-gray-700"
              indicatorClassName={
                flashStatus.status === 'error'
                  ? 'bg-red-500'
                  : flashStatus.status === 'complete'
                  ? 'bg-green-500'
                  : 'bg-blue-500'
              }
            />
          </div>
        )}

        {flashStatus.status === 'complete' && deviceId && (
          <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-md">
            <p className="text-sm text-green-500">Device ID: {deviceId}</p>
            <p className="text-xs text-gray-400 mt-1">
              Keep this ID for future reference
            </p>
          </div>
        )}

        {flashStatus.status === 'error' && (
          <div className="mt-4">
            <p className="text-sm text-gray-400">Troubleshooting tips:</p>
            <ul className="list-disc list-inside text-sm text-gray-400 mt-2">
              <li>Verify USB device connection</li>
              <li>Try alternate USB port</li>
              <li>Confirm selected port matches device</li>
              <li>Ensure ESP device is in flash mode</li>
              <li>Check internet connectivity</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSetup;