import { QueryClient } from '@tanstack/react-query';
import { Dispatch } from 'redux';
import { WebSocketMessage } from '../types/patient';
import { WEBSOCKET_CONFIG } from '../config/constants';
import { setConnected, setError, clearError } from '../store/slices/websocketSlice';
import { updatePatient, clearUpdateHighlight } from '../store/slices/patientSlice';
import { QUERY_KEYS } from '../hooks/queries';

interface WebSocketHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export class WebSocketService {
  private static instance: WebSocketService | null = null;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private dispatch: Dispatch | null = null;
  private queryClient: QueryClient | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  initialize(dispatch: Dispatch, queryClient: QueryClient) {
    this.dispatch = dispatch;
    this.queryClient = queryClient;
  }

  connect(handlers: WebSocketHandlers = {}) {
    if (!this.dispatch || !this.queryClient) {
      throw new Error('WebSocketService must be initialized before connecting');
    }

    try {
      this.ws = new WebSocket(WEBSOCKET_CONFIG.URL);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.dispatch!(setConnected(true));
        this.reconnectAttempts = 0;
        handlers.onConnect?.();
      };

      this.ws.onmessage = this.handleMessage;
      this.ws.onclose = this.handleClose(handlers);
      this.ws.onerror = this.handleError(handlers);

    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleError(handlers)(new Event('error'));
    }

    return () => this.disconnect();
  }

  private handleMessage = (event: MessageEvent) => {
    if (!this.dispatch || !this.queryClient) return;

    try {
      const message = JSON.parse(event.data);
      if (this.isValidWebSocketMessage(message)) {
        this.updatePatientData(message);
      } else {
        console.warn('Invalid message format:', message);
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
      this.dispatch(setError('Error processing update'));
    }
  };

  private handleClose = (handlers: WebSocketHandlers) => () => {
    if (!this.dispatch) return;

    console.log('WebSocket Disconnected');
    this.dispatch(setConnected(false));
    handlers.onDisconnect?.();
    this.attemptReconnection();
  };

  private handleError = (handlers: WebSocketHandlers) => (event: Event) => {
    if (!this.dispatch) return;

    console.error('WebSocket Error:', event);
    this.dispatch(setError('WebSocket connection error'));
    handlers.onError?.(new Error('WebSocket connection error'));
  };

  private attemptReconnection() {
    if (this.reconnectAttempts >= WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting reconnection... (${this.reconnectAttempts + 1}/${WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS})`);
      this.reconnectAttempts++;
      this.connect();
    }, WEBSOCKET_CONFIG.RECONNECT_INTERVAL);
  }

  private updatePatientData(message: WebSocketMessage) {
    if (!this.dispatch || !this.queryClient) return;

    this.dispatch(updatePatient({
      patientId: message.patientId,
      vitals: message.vitals,
      isUpdated: true,
    }));

    this.updateQueryCache(message);

    setTimeout(() => {
      this.dispatch!(clearUpdateHighlight());
      this.clearHighlightInCache(message.patientId);
    }, 2000);
  }

  private updateQueryCache(message: WebSocketMessage) {
    if (!this.queryClient) return;

    this.queryClient.setQueryData(QUERY_KEYS.patients, (oldData: any) => {
      if (!Array.isArray(oldData)) return oldData;
      const updatedPatients = oldData.map(patient =>
        patient.id === message.patientId
          ? { ...patient, vitals: { ...patient.vitals, ...message.vitals }, isUpdated: true }
          : patient
      );
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      return updatedPatients;
    });

    this.queryClient.setQueryData(
      QUERY_KEYS.patient(message.patientId),
      (oldData: any) => {
        if (!oldData) return oldData;
        const updatedPatient = {
          ...oldData,
          vitals: { ...oldData.vitals, ...message.vitals },
          isUpdated: true,
        };
        localStorage.setItem(`patient-${message.patientId}`, JSON.stringify(updatedPatient));
        return updatedPatient;
      }
    );
  }

  private clearHighlightInCache(patientId: string) {
    if (!this.queryClient) return;

    this.queryClient.setQueryData(QUERY_KEYS.patients, (oldData: any) => {
      if (!Array.isArray(oldData)) return oldData;
      const clearedPatients = oldData.map(patient =>
        patient.id === patientId
          ? { ...patient, isUpdated: false }
          : patient
      );
      localStorage.setItem('patients', JSON.stringify(clearedPatients));
      return clearedPatients;
    });
  }

  private isValidWebSocketMessage(message: any): message is WebSocketMessage {
    return (
      typeof message === 'object' &&
      message !== null &&
      'patientId' in message &&
      'vitals' in message &&
      typeof message.patientId === 'string' &&
      typeof message.vitals === 'object'
    );
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.dispatch) {
      this.dispatch(clearError());
    }
  }
}

export default WebSocketService;
