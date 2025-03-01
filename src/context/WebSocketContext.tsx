// context/WebSocketContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, FC } from "react";
import io, { Socket } from "socket.io-client";
import { PUCValidationResponse, PUCValidationResult } from "../types/pucValidationResponse";
import { PollutionData } from "../types/pollution";

interface WebSocketContextType {
  validationResponse: PUCValidationResponse | null;
  error: string | null;
  emitEvent: (eventName: string, data: unknown) => void;
  pollutionData: PollutionData | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [validationResponse, setValidationResponse] = useState<PUCValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollutionData, setPollutionData] = useState<PollutionData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("Initializing WebSocket connection");
    const newSocket = io("http://43.204.97.229:8000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    });

    newSocket.on('puc_validation_result', (data: { data: PUCValidationResult[] }) => {
      console.log('Received puc_validation_result:', data);
      setValidationResponse({
        message: "PUC Validation Result",
        response: data.data,
        status: "success",
        length: 0
      });
    });
    
    newSocket.on("puc_validation_error", (data: { error: string }) => {
      console.log("Received puc_validation_error:", data);
      setError(data.error);
    });

    newSocket.on("pollution_data_update", (data: PollutionData) => {
      setPollutionData(data);
    });

    newSocket.on("pollution_data_error", (data: { error: string }) => {
      setError(data.error);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
      setIsConnected(false);
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

  const contextValue: WebSocketContextType = {
    validationResponse,
    error,
    emitEvent,
    pollutionData,
    isConnected
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};