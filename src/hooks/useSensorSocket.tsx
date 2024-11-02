// hooks/useSensorSocket.tsx
import { useState, useEffect, useCallback, useRef } from 'react';

// Types matching your exact backend data structure
interface SensorData {
  rs_ro_ratio: number;
  ppm: number;
  timestamp: string;
}

interface WebSocketMessage {
  type: string;
  data: SensorData;
}

interface UseSensorSocketReturn {
  sensorData: SensorData | null;
  isConnected: boolean;
  error: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  reconnect: () => void;
  allReadings: SensorData[];
}

// Update this URL to match your Express server's address
const SOCKET_URL = 'ws://192.168.15.62:3001'; // Match your ESP8266 IP
const RECONNECT_DELAY = 5000;

export const useSensorSocket = (): UseSensorSocketReturn => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [allReadings, setAllReadings] = useState<SensorData[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
      }

      setConnectionStatus('connecting');
      
      const ws = new WebSocket(SOCKET_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to sensor WebSocket');
        setIsConnected(true);
        setConnectionStatus('connected');
        setError(null);
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('Received WebSocket message:', message); // Debug log
          
          if (message.type === 'gas_detection') {
            setSensorData(message.data);
            setAllReadings(prev => [message.data, ...prev].slice(0, 100));
          }
        } catch (error) {
          console.error('Error parsing sensor data:', error);
          setError('Failed to parse sensor data');
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from sensor WebSocket');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, RECONNECT_DELAY);
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setConnectionStatus('disconnected');
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setError('Failed to connect to sensor');
      setConnectionStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    connect();
  }, [connect]);

  return {
    sensorData,
    isConnected,
    error,
    connectionStatus,
    reconnect,
    allReadings
  };
};

export default useSensorSocket;