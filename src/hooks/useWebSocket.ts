import { useEffect, useCallback } from 'react';
import { useAppDispatch } from './redux';
import { WebSocketMessage } from '../types/patient';
import { CONFIG } from '../config/constants';
import { setConnected, setError } from '../store/slices/websocketSlice';
import { updatePatient, clearUpdateHighlight } from '../store/slices/patientSlice';
import { PatientService } from '../services/patientService';

export const useWebSocket = () => {
  const dispatch = useAppDispatch();

  const connect = useCallback(() => {
    const ws = new WebSocket(CONFIG.WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      dispatch(setConnected(true));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (isValidWebSocketMessage(message)) {
          dispatch(updatePatient({
            ...message,
            isUpdated: true, 
          }));
          const patientService = PatientService.getInstance();
          const cachedPatients = patientService.getCachedPatients();
          if (cachedPatients) {
            const updatedPatients = cachedPatients.map(patient =>
              patient.id === message.patientId
                ? { ...patient, vitals: { ...patient.vitals, ...message.vitals }, isUpdated: true }
                : patient
            );
            patientService.persistPatientsToCache(updatedPatients);
          }
          setTimeout(() => {
            dispatch(clearUpdateHighlight());
          }, 2000);
        } else {
          console.warn('Invalid message format:', message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('WebSocket message error:', errorMessage);
        dispatch(setError('Error processing update'));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      dispatch(setConnected(false));
      setTimeout(connect, 3000);
    };

    ws.onerror = (event) => {
      console.error('WebSocket Error:', event);
      dispatch(setError('WebSocket connection error'));
    };

    return ws;
  }, [dispatch]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.close();
    };
  }, [connect]);
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
