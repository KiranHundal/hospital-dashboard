export interface VitalSigns {
    bloodPressure: string;
    heartRate: number;
    oxygenLevel: number;
    timestamp?: number;

  }

  export interface Patient {
    id: string;
    name: string ;
    age: number;
    gender: "male" | "female" | "other";
    room: string ;
    vitals: VitalSigns;
    isUpdated?: boolean;
    lastUpdateTime?: number;
    fallRisk?: boolean;
    isolation?: boolean;
    npo?: boolean;
    [key: string]: unknown;
    
  }


  export interface PatientUpdate {
    patientId: string;
    vitals: Partial<VitalSigns>;
    isUpdated?: boolean;
    lastUpdateTime?: number;
  }


export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}
