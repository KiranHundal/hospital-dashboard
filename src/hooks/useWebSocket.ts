import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from './redux';
import WebSocketService from '../services/WebSocketService';

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();
    webSocketService.initialize(dispatch, queryClient);

    const cleanup = webSocketService.connect({
      onConnect: () => {
        console.log('WebSocket connection established');
      },
      onDisconnect: () => {
        console.log('WebSocket connection lost');
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    return cleanup;
  }, [dispatch, queryClient]);
};

export default useWebSocket;
