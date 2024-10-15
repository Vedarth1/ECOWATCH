"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, FC } from "react";
import io, { Socket } from "socket.io-client";
import { PUCValidationResponse, PUCValidationResult } from "../types/pucValidationResponse";


interface WebSocketContextType {
  validationResponse: PUCValidationResponse | null;
  error: string | null;
  emitEvent: (eventName: string, data: unknown) => void;
}


const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);


export const WebSocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [validationResponse, setValidationResponse] = useState<PUCValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Initializing WebSocket connection");
    const newSocket = io("http://localhost:8000"); // Update URL as needed
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

  return (
    <WebSocketContext.Provider value={{ validationResponse, error, emitEvent }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};
