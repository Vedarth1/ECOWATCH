import { useState, useEffect, useCallback, useRef } from 'react';

interface SensorData {
  rs_ro_ratio: number;
  ppm: number;
  timestamp: string;
}

interface WebSocketMessage {
  type: string;
  data?: SensorData;
  message?: string;
  clientId?: string;
  timestamp?: number;
}

interface UseSensorSocketReturn {
  sensorData: SensorData | null;
  isConnected: boolean;
  error: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  reconnect: () => void;
  allReadings: SensorData[];
  latency: number;
}

const SOCKET_URL = 'ws://192.168.34.249:3001';
const RECONNECT_DELAY = 5000;
const PING_INTERVAL = 15000;

export const useSensorSocket = (): UseSensorSocketReturn => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [allReadings, setAllReadings] = useState<SensorData[]>([]);
  const [latency, setLatency] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const pingTimeoutRef = useRef<ReturnType<typeof setInterval>>();
  const pingStartTimeRef = useRef<number>();

  const sendPing = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      pingStartTimeRef.current = Date.now();
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
    }
  }, []);

  const startPingInterval = useCallback(() => {
    if (pingTimeoutRef.current) {
      clearInterval(pingTimeoutRef.current);
    }
    pingTimeoutRef.current = setInterval(sendPing, PING_INTERVAL);
    sendPing(); // Send initial ping
  }, [sendPing]);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    console.log("WebSocket message received:", message); // Add this line
    try {
      switch (message.type) {
        case 'gas_detection':
          if (message.data) {
            setSensorData(message.data);
            setAllReadings(prev => [message.data, ...prev].slice(0, 100));
          }
          break;
        case 'pong':
          if (message.timestamp && pingStartTimeRef.current) {
            setLatency(Date.now() - pingStartTimeRef.current);
          }
          break;
        case 'connection':
          console.log('Connection established:', message.message);
          break;
        default:
          console.log('Received unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      setError('Failed to parse message data');
    }
  }, []);
  

  const handleWebSocketClose = useCallback(() => {
    console.log('Disconnected from sensor WebSocket');
    setIsConnected(false);
    setConnectionStatus('disconnected');

    if (pingTimeoutRef.current) {
      clearInterval(pingTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, RECONNECT_DELAY);
  }, []);

  const handleWebSocketError = useCallback((event: Event) => {
    console.error('WebSocket error:', event);
    setError('WebSocket connection error');
    setConnectionStatus('disconnected');
  }, []);

  const connect = useCallback(() => {
    try {
      setConnectionStatus('connecting');

      const ws = new WebSocket(SOCKET_URL);
      wsRef.current = ws;

      ws.addEventListener('open', () => {
        console.log('Connected to sensor WebSocket');
        setIsConnected(true);
        setConnectionStatus('connected');
        setError(null);
        startPingInterval();
      });

      ws.addEventListener('message', (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleWebSocketMessage(message);
      });

      ws.addEventListener('close', handleWebSocketClose);
      ws.addEventListener('error', handleWebSocketError);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setError('Failed to connect to sensor');
      setConnectionStatus('disconnected');
    }
  }, [startPingInterval, handleWebSocketMessage, handleWebSocketClose, handleWebSocketError]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingTimeoutRef.current) {
        clearInterval(pingTimeoutRef.current);
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
    allReadings,
    latency
  };
};

export default useSensorSocket;