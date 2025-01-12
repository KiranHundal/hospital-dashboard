import { useState, useEffect, useCallback } from 'react';
import { WebSocketMessage } from '../types/patient';
import { CONFIG } from '../config/constants';

interface UseWebSocketOptions {
  onPatientUpdate: (message: WebSocketMessage) => void;
}

export const useWebSocket = ({ onPatientUpdate }: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(CONFIG.WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (isValidWebSocketMessage(message)) {
          onPatientUpdate(message);
        } else {
          console.warn('Invalid message format:', message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('WebSocket message error:', errorMessage);
        setError('Error processing update');
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      setTimeout(connect, 3000);
    };

    ws.onerror = (event) => {
      console.error('WebSocket Error:', event);
      setError('WebSocket connection error');
      setIsConnected(false);
    };

    return ws;
  }, [onPatientUpdate]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.close();
    };
  }, [connect]);

  return {
    isConnected,
    error
  };
};

function isValidWebSocketMessage(message: unknown): message is WebSocketMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'patientId' in message &&
    'vitals' in message &&
    typeof (message as WebSocketMessage).patientId === 'string' &&
    typeof (message as WebSocketMessage).vitals === 'object'
  );
}
