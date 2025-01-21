import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Progress from '../ui/progress';

const API_BASE_URL = 'http://localhost:8000/api';
const AWS_API_URL = 'https://f3nf46xnyl.execute-api.ap-south-1.amazonaws.com/test';

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
          // Set the first port as default if available and no port is selected
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
    const interval = setInterval(fetchPorts, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [selectedPort]);

  const verifyAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token && !axios.defaults.headers.common['Authorization']) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const handleDeviceRegistration = async () => {
    try {
      if (!selectedPort) {
        setError('Please select a device port');
        return;
      }

      setIsLoading(true);
      setError(null);
      setFlashStatus({
        status: 'preparing',
        message: 'Registering device...',
        progress: 20,
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${AWS_API_URL}/devices`,
        { ssid, password },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { deviceId: newDeviceId, firmwareUrl } = response.data;
      setDeviceId(newDeviceId);

      setFlashStatus({
        status: 'flashing',
        message: 'Flashing device firmware...',
        progress: 60,
      });

      const flashResponse = await axios.post(`${API_BASE_URL}/flash`, {
        firmwareUrl,
        portPath: selectedPort,
      });

      if (flashResponse.data.success) {
        setFlashStatus({
          status: 'complete',
          message: 'Device successfully configured!',
          progress: 100,
        });
        onComplete?.();
      } else {
        throw new Error('Flashing failed');
      }
    } catch (error) {
      console.error('Setup failed:', error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } else if (error.response) {
        setError(error.response.data.error || 'Device setup failed');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      }
    } else {
      setError('Device setup failed. Please try again.');
    }

    setFlashStatus({
      status: 'error',
      message: 'Failed to configure device',
      progress: 0,
    });
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

        <button
          onClick={handleDeviceRegistration}
          disabled={isLoading || authLoading || !ssid || !password || !selectedPort}
          className={`w-full py-2 px-4 rounded text-white transition-colors ${
            isLoading || authLoading || !ssid || !password || !selectedPort
              ? 'bg-blue-500/50 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Configuring Device...' : 'Configure Device'}
        </button>

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
            <p className="text-sm text-gray-400">Common solutions:</p>
            <ul className="list-disc list-inside text-sm text-gray-400 mt-2">
              <li>Make sure the device is properly connected via USB</li>
              <li>Try a different USB port</li>
              <li>Verify the selected port matches your device</li>
              <li>Check if the ESP device is in flash mode</li>
              <li>Check your internet connection</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSetup;