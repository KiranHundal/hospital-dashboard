import { QueryClient } from '@tanstack/react-query';
import { Dispatch, AnyAction } from 'redux';
import { WebSocketMessage } from './patient';

export interface Patient {
  id: string;
  vitals: Record<string, unknown>;
  isUpdated: boolean;
  [key: string]: unknown;
}

export interface WebSocketConfig {
  url: string;
  queryClient?: QueryClient;
  dispatch?: Dispatch<AnyAction>;
  onMessage?: (data: WebSocketMessage) => void;
  onError?: (error: Event) => void;
}
