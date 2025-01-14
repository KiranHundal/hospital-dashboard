export interface VitalSigns {
    bloodPressure: string;
    heartRate: number;
    oxygenLevel: number;
  }

  export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    room: string;
    vitals: {
      bloodPressure: string;
      oxygenLevel: number;
      heartRate: number;
    };
    isUpdated?: boolean;
  }


  export interface PatientUpdate {
    patientId: string;
    vitals: Partial<VitalSigns>;
  }


  export interface WebSocketMessage {
    patientId: string;
    vitals: Partial<VitalSigns>;
    timestamp?: string;
    isUpdated?: boolean;

  }
