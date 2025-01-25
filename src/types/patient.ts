export interface VitalSigns {
    bloodPressure: string;
    heartRate: number;
    oxygenLevel: number;
  }

  export interface Patient {
    id: string;
    name: string ;
    age: number;
    gender: "male" | "female" | "other";
    room: string ;
    vitals: {
      bloodPressure: string;
      oxygenLevel: number;
      heartRate: number;
    };
    isUpdated?: boolean;
    [key: string]: unknown;
  }


  export interface PatientUpdate {
    patientId: string;
    vitals: Partial<VitalSigns>;
  }


export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

  export interface WebSocketMessage {
    patientId: string;
    vitals: Partial<VitalSigns>;
    timestamp?: string;
    isUpdated?: boolean;

  }
  // export type WebSocketMessage1 = {
  //   type: 'UPDATE_VITALS' | 'NEW_PATIENT';
  // } & (
  //   | {
  //       type: 'UPDATE_VITALS';
  //       patientId: string;
  //       vitals: Partial<VitalSigns>;
  //     }
  //   | {
  //       type: 'NEW_PATIENT';
  //       patient: Patient;
  //     }
  // );
