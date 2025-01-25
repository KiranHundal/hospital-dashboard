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
