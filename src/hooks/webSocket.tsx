"use client"

import { useState, useEffect, useRef } from 'react';
import { ImageProcessingResponse } from '../types/ImageProcessing';

export const useWebSocket = (url: string) => {
  const [message, setMessage] = useState<ImageProcessingResponse | null>(null); // Update type here
  const [isConnected, setIsConnected] = useState(false);
  

  useEffect(() => {
    const socket:WebSocket | null  = null  
    const connectWebSocket = () => {
			try {
				const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
				const officeName = localStorage.getItem("officeName");
				if (officeName) {
					socket = new WebSocket(${socketUrl}${officeName});
					socket.addEventListener("open", () => {
						console.log("WebSocket connection established");
					});
					socket.addEventListener("message", (event) => {
						// console.log("A MESSAGE IS RECEIVED: ", JSON.parse(event.data));
						setReportsData((prevData) => [...prevData, JSON.parse(event.data)]);
					});
					socket.addEventListener("error", (error) => {});
				}
			} catch (error) {}
		};
    connectWebSocket();
  }, []);

  return { message, isConnected };
};
