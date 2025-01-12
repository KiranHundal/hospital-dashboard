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

  export interface PatientUpdate {
    patientId: string;
    vitals: Partial<VitalSigns>;
  }


  export interface WebSocketMessage {
    patientId: string;
    vitals: Partial<VitalSigns>;
    timestamp?: string;
  }
