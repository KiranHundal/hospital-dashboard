import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from './redux';
import WebSocketService from '../services/WebSocketService';
import { SubscriptionTopic } from '../types/websocket';

export const useWebSocket = (topics: SubscriptionTopic[] = []) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();
    webSocketService.initialize(dispatch, queryClient);

    const cleanup = webSocketService.connect({
      onConnect: () => {
        topics.forEach(topic => webSocketService.subscribe(topic));
        console.log('WebSocket connection established');
      },
      onDisconnect: () => {
        topics.forEach(topic => webSocketService.unsubscribe(topic));
        console.log('WebSocket connection lost');
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    return () => {
      webSocketService.disconnect();
      cleanup();
    };
  }, [dispatch, queryClient, topics]);

  return WebSocketService.getInstance();
};
