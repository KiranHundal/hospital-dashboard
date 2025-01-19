import { useEffect, useRef } from "react";

export const useWebSocketConnection = (url: string, onMessage: (data: any) => void, onError?: (error: Event) => void) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket Connected");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("WebSocket message parse error:", err);
        onError?.(err);
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket Error:", event);
      onError?.(event);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [url, onMessage, onError]);

  return wsRef.current;
};
