import { Patient, VitalSigns } from "./patient";

export type SubscriptionTopic = 'vitals' | 'admissions' | 'discharges' | `room-${number}`;

export type WebSocketMessage = {
  topic: SubscriptionTopic;
  data: TopicData[SubscriptionTopic];
};

type TopicData = {
  vitals: PatientUpdate;
  admissions: NewPatient;
  discharges: DischargePatient;
  [K: `room-${number}`]: RoomUpdate;
};

export type PatientUpdate = {
  type: 'UPDATE_ROOM' | 'UPDATE_VITALS'; 
  patientId: string;
  vitals: Partial<VitalSigns>;
};

export type NewPatient = {
  type: 'NEW_PATIENT';
  patient: Patient;
};

export type DischargePatient = {
  type: 'DISCHARGE';
  patientId: string;
};

export type RoomUpdate = {
  type: 'ROOM_UPDATE';
  roomNumber: number;
  patients: PatientUpdate[];
};
