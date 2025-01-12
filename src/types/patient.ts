// src/types/patient.ts
export interface VitalSigns {
    bloodPressure: string;
    heartRate: number;
    oxygenLevel: number;
  }

  export interface Patient {
    id: string;
    name: string;
    age: number;
    room: string;
    gender: 'male' | 'female';
    vitals: VitalSigns;
  }

  export interface WebSocketMessage {
    patientId: string;
    vitals: Partial<VitalSigns>;
    timestamp?: string;
  }

  export type WebSocketMessageCallback = (message: WebSocketMessage) => void;
