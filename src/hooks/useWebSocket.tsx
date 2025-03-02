"use client";
import { useState, useEffect, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { PUCValidationResponse, PUCValidationResult } from '../types/pucValidationResponse';


const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [validationResponse, setValidationResponse] = useState<PUCValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Initializing WebSocket connection");
    const newSocket = io("https://43.204.97.229:8000"); 
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
    });

    newSocket.on('puc_validation_result', (data: { data: PUCValidationResult[] }) => {
      console.log('Received puc_validation_result:', data);
      setValidationResponse({
        message: "PUC Validation Result",
        response: data.data,
        status: "success", 
      });
    });
    

    newSocket.on("puc_validation_error", (data: { error: string }) => {
      console.log("Received puc_validation_error:", data);
      setError(data.error);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
    });

    return () => {
      console.log("Cleaning up WebSocket connection");
      newSocket.disconnect();
    };
  }, []);

  const emitEvent = useCallback(
    (eventName: string, data: unknown) => {
      if (socket) {
        console.log("Emitting event:", eventName, data);
        socket.emit(eventName, data);
      } else {
        console.log("Socket not available, cannot emit event:", eventName);
      }
    },
    [socket]
  );

  return { validationResponse, error, emitEvent };
};

export default useWebSocket;
