import { QueryClient } from '@tanstack/react-query';
import { Dispatch } from 'redux';
import { Patient, PatientUpdate } from '../types/patient';
import { WEBSOCKET_CONFIG } from '../config/constants';
import { setConnected, setError, clearError } from '../store/slices/websocketSlice';
import { updatePatient, clearUpdateHighlight } from '../store/slices/patientSlice';
import { QUERY_KEYS } from '../hooks/queries';
import { BatchAdmissionsUpdate, BatchDischargesUpdate, BatchVitalsUpdate, DischargePatient, NewPatient, WSPatientUpdate, RoomUpdate, SubscriptionTopic, WebSocketMessage } from '../types/websocket';

interface WebSocketHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export class WebSocketService {
  private static instance: WebSocketService | null = null;
  private ws: WebSocket | null = null;
  private isReconnecting = false;
  private maxRetries = 5;
  private retryDelay = 3000;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private subscriptions = new Set<SubscriptionTopic>();
  private isConnected = false;
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
        console.log('WebSocket connected');
        this.isConnected = true;
        this.isReconnecting = false;
        this.reconnectAttempts = 0;
        this.clearReconnectionTimer();

        this.subscriptions.forEach((topic) => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'SUBSCRIBE', topic }));
          }
        });

        this.dispatch!(setConnected(true));
        handlers.onConnect?.();
      };

      this.ws.onmessage = this.handleMessage;

      this.ws.onclose = () => {
        if (this.isConnected) {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.dispatch!(setConnected(false));
          handlers.onDisconnect?.();
        }

        if (!this.isReconnecting) {
          this.attemptReconnection();
        }
      };

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        this.dispatch?.(setError('WebSocket connection error'));
        handlers.onError?.(new Error('WebSocket connection error'));
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      handlers.onError?.(new Error('WebSocket connection error'));
    }

    return () => this.disconnect();
  }

  subscribe(topic: SubscriptionTopic) {
    this.subscriptions.add(topic);
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'SUBSCRIBE', topic }));
    }
  }

  unsubscribe(topic: SubscriptionTopic) {
    this.subscriptions.delete(topic);
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'UNSUBSCRIBE', topic }));
    }
  }

  private isBatchVitalsUpdate(data: unknown): data is BatchVitalsUpdate {
    return (
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      data.type === 'BATCH_UPDATE_VITALS' &&
      'updates' in data
    );
  }

  private isBatchAdmissions(data: unknown): data is BatchAdmissionsUpdate {
    return (
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      data.type === 'BATCH_NEW_PATIENTS' &&
      'patients' in data
    );
  }

  private isBatchDischarges(data: unknown): data is BatchDischargesUpdate {
    return (
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      data.type === 'BATCH_DISCHARGES' &&
      'discharges' in data
    );
  }

  private handleMessage = (event: MessageEvent) => {
    if (!this.dispatch || !this.queryClient) return;

    try {
      const message = JSON.parse(event.data);
      console.log('Received WebSocket message:', message); // Debug log

      if (this.isValidWebSocketMessage(message)) {
        const { topic, data } = message;
        if (!this.subscriptions.has(topic)) return;

        switch (topic) {
          case 'vitals':
            if (this.isBatchVitalsUpdate(data)) {
              console.log('Processing batch vitals update:', data);
              data.updates.forEach(update => {
                const typedUpdate: WSPatientUpdate = {
                  ...update,
                  type: 'UPDATE_VITALS'
                };
                this.updatePatientData(typedUpdate);
              });
            } else if (this.isVitalsUpdate(data)) {
              console.log('Processing single vital update:', data); // Debug log

              this.updatePatientData(data);
            }
            break;
          case 'admissions':
            if (this.isBatchAdmissions(data)) {
              data.patients.forEach(admission => this.handleNewPatient(admission.patient));
            } else if (this.isNewPatient(data)) {
              this.handleNewPatient(data.patient);
            }
            break;
          case 'discharges':
            if (this.isBatchDischarges(data)) {
              data.discharges.forEach(discharge => this.removePatient(discharge.patientId));
            } else if (this.isDischarge(data)) {
              this.removePatient(data.patientId);
            }
            break;
          default:
            if (topic.startsWith('room-') && this.isRoomUpdate(data)) {
              this.handleRoomUpdate(data);
            }
        }
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
      this.dispatch?.(setError('Error processing update'));
    }
  };

  private attemptReconnection() {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxRetries) {
      console.log('Max reconnection attempts reached or already reconnecting');
      return;
    }

    this.isReconnecting = true;
    this.reconnectTimeout = setTimeout(() => {
      if (this.reconnectAttempts < this.maxRetries) {
        console.log(`Reconnection attempt ${this.reconnectAttempts + 1}/${this.maxRetries}`);
        this.reconnectAttempts++;
        this.connect();
      }
      this.isReconnecting = false;
    }, this.retryDelay);
  }

  disconnect() {
    this.isConnected = false;
    this.isReconnecting = false;

    this.clearReconnectionTimer();

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }

    this.dispatch?.(clearError());
  }

  private clearReconnectionTimer() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private isVitalsUpdate(data: unknown): data is WSPatientUpdate {
    return (data as WSPatientUpdate).type === 'UPDATE_VITALS';
  }

  private isNewPatient(data: unknown): data is NewPatient {
    return (data as NewPatient).type === 'NEW_PATIENT';
  }

  private isDischarge(data: unknown): data is DischargePatient {
    return (data as DischargePatient).type === 'DISCHARGE';
  }
  private isRoomUpdate(data: unknown): data is RoomUpdate {
    return (
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      data.type === 'ROOM_UPDATE' &&
      Array.isArray((data as RoomUpdate).patients)
    );
  }
  private handleNewPatient(patient: Patient) {
    if (!this.queryClient) return;

    const timestamp = Date.now();
    console.log('Adding new patient with timestamp:', timestamp);

    this.queryClient.setQueryData(QUERY_KEYS.patients, (oldData: Patient[] = []) => {
      const patientExists = oldData.some((p) => p.id === patient.id);

      if (patientExists) {
        console.warn(`Patient with ID ${patient.id} already exists. Skipping addition.`);
        return oldData;
      }

      const newPatient = {
        ...patient,
        isUpdated: true,
        lastUpdateTime: timestamp
      };

      const newData = [...oldData, newPatient];
      console.log('Updated patients after addition:', newData);
      localStorage.setItem('patients', JSON.stringify(newData));
      return newData;
    });

    this.queryClient.setQueryData(
      QUERY_KEYS.patient(patient.id),
      { ...patient, isUpdated: true, lastUpdateTime: timestamp }
    );

    setTimeout(() => {
      this.dispatch!(clearUpdateHighlight());
      this.clearHighlightInCache(patient.id);
    }, 2000);
  }

  private removePatient(patientId: string) {
    if (!this.queryClient) return;

    this.queryClient.setQueryData(QUERY_KEYS.patients, (oldData: Patient[] = []) => {
      const newData = oldData.filter((p) => p.id !== patientId);
      localStorage.setItem('patients', JSON.stringify(newData));
      return newData;
    });

    this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patient(patientId) });
    localStorage.removeItem(`patient-${patientId}`);
  }
  private updatePatientData(message: WSPatientUpdate) {
    if (!this.dispatch || !this.queryClient) return;

    const updateTime = Date.now();
  console.log('Updating patient data:', {
    patientId: message.patientId,
    updateTime,
    message
  });

    this.dispatch(updatePatient({
      patientId: message.patientId,
      vitals: message.vitals,
      isUpdated: true,
      lastUpdateTime: Date.now()
    }));

    this.updateQueryCache(message);

    setTimeout(() => {
      this.dispatch!(clearUpdateHighlight());
      this.clearHighlightInCache(message.patientId);
    }, 2000);
  }
  private updateQueryCache(message: WSPatientUpdate) {
    if (!this.queryClient) return;

    const updateTime = Date.now();
    console.log('Updating query cache with timestamp:', updateTime);

    this.queryClient.setQueryData(QUERY_KEYS.patients, (oldData: Patient[] = []) => {
      const updatedPatients = oldData.map(patient =>
        patient.id === message.patientId
          ? {
              ...patient,
              vitals: { ...patient.vitals, ...message.vitals },
              isUpdated: true,
              lastUpdateTime: updateTime
            }
          : patient
      );
      console.log('Updated patients in cache:', updatedPatients);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      return updatedPatients;
    });

    this.queryClient.setQueryData(
      QUERY_KEYS.patient(message.patientId),
      (oldData: Patient | undefined) => {
        if (!oldData) return oldData;
        const updatedPatient = {
          ...oldData,
          vitals: { ...oldData.vitals, ...message.vitals },
          isUpdated: true,
          lastUpdateTime: updateTime
        };
        localStorage.setItem(`patient-${message.patientId}`, JSON.stringify(updatedPatient));
        return updatedPatient;
      }
    );
  }

  private clearHighlightInCache(patientId: string) {
    if (!this.queryClient) return;

    this.queryClient.setQueryData(QUERY_KEYS.patients, (oldData: Patient[] = []) => {
      const clearedPatients = oldData.map(patient =>
        patient.id === patientId
          ? { ...patient, isUpdated: false }
          : patient
      );
      localStorage.setItem('patients', JSON.stringify(clearedPatients));
      return clearedPatients;
    });

    this.queryClient.setQueryData(
      QUERY_KEYS.patient(patientId),
      (oldData: Patient | undefined) => {
        if (!oldData) return oldData;
        const clearedPatient = { ...oldData, isUpdated: false };
        localStorage.setItem(`patient-${patientId}`, JSON.stringify(clearedPatient));
        return clearedPatient;
      }
    );
  }

  private clearRoomHighlights(room: string) {
    if (!this.queryClient) return;

    this.queryClient.setQueryData(QUERY_KEYS.patients, (oldData: Patient[] = []) => {
      const clearedPatients = oldData.map(patient => {
        if (patient.room === room) {
          return { ...patient, isUpdated: false };
        }
        return patient;
      });

      localStorage.setItem('patients', JSON.stringify(clearedPatients));
      return clearedPatients;
    });
  }

  private handleRoomUpdate(data: RoomUpdate) {
    const newRoom = data.roomNumber.toString();
    const updateTime = Date.now();

    if (!this.queryClient) return;

    console.log('Handling room update with timestamp:', updateTime);

    this.queryClient.setQueryData(QUERY_KEYS.patients, (oldData: Patient[] = []) => {
      const updatedPatients = oldData.map((patient) => {
        const updateForPatient = data.patients.find((p) => p.patientId === patient.id);

        if (updateForPatient) {
          return {
            ...patient,
            room: newRoom,
            vitals: { ...patient.vitals, ...updateForPatient.vitals },
            isUpdated: true,
            lastUpdateTime: updateTime
          };
        }
        return patient;
      });

      console.log('Updated patients after room update:', updatedPatients);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      return updatedPatients;
    });

    setTimeout(() => {
      this.dispatch!(clearUpdateHighlight());
      data.patients.forEach((patientUpdate) => {
        this.clearHighlightInCache(patientUpdate.patientId);
      });
    }, 2000);
  }




  private isValidWebSocketMessage(message: unknown): message is WebSocketMessage {
    return (
      typeof message === 'object' &&
      message !== null &&
      'topic' in message &&
      'data' in message
    );
  }
}

export default WebSocketService;
