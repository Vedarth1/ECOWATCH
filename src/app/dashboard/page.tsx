'use client'
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/webSocket';
import { ImageProcessingResponse } from '../../types/ImageProcessing';

const Dashboard = () => {
  const { message, isConnected } = useWebSocket('ws://localhost:8000/socket.io/?EIO=4&transport=websocket'); // Update with your server URL
  const [receivedData, setReceivedData] = useState<ImageProcessingResponse | null>(null); // Update type here

  useEffect(() => {
    if (message) {
      console.log('Message received from server:', message);
      setReceivedData(message); // Set the received message directly
    }
  }, [message]);

  return (
    <div>
      <div>Dashboard {isConnected ? '(Connected)' : '(Disconnected)'}</div>
      <div>
        <h3>Data from WebSocket:</h3>
        {receivedData ? (
          <pre>{JSON.stringify(receivedData)}</pre>
        ) : (
          <div>No data received yet...</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
