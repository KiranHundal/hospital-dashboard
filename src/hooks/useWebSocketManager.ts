import { useMemo } from 'react';
import { useAppSelector } from './redux';
import { selectWebSocketState, selectUpdatedPatientId } from '../store/selectors/patientSelectors';
import { useWebSocket } from './useWebSocket';
import { SubscriptionTopic } from '../types/websocket';
import { Patient } from '../types/patient';

export const useWebSocketManager = (patients: Patient[]) => {
  const roomTopics = useMemo(() => {
    const uniqueRooms = [...new Set(patients.map(p => p.room))];
    return uniqueRooms.map(room => `room-${room}` as SubscriptionTopic);
  }, [patients]);

  useWebSocket(["vitals", "admissions", "discharges", ...roomTopics]);

  const { isConnected } = useAppSelector(selectWebSocketState);
  const updatedPatientId = useAppSelector(selectUpdatedPatientId);

  return { isConnected, updatedPatientId };
};
