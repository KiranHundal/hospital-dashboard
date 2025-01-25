import { Patient, VitalSigns } from "./patient";

export type SubscriptionTopic = 'vitals' | 'admissions' | 'discharges' | `room-${number}`;

export type WebSocketMessage = {
  topic: SubscriptionTopic;
  data: TopicData[SubscriptionTopic] | BatchUpdate[SubscriptionTopic];
};

type TopicData = {
  vitals: PatientUpdate;
  admissions: NewPatient;
  discharges: DischargePatient;
  [K: `room-${number}`]: RoomUpdate;
};

type BatchUpdate = {
  vitals: BatchVitalsUpdate;
  admissions: BatchAdmissionsUpdate;
  discharges: BatchDischargesUpdate;
  [K: `room-${number}`]: RoomUpdate;
};

export type BatchVitalsUpdate = {
  type: 'BATCH_UPDATE_VITALS';
  updates: PatientUpdate[];
};

export type BatchAdmissionsUpdate = {
  type: 'BATCH_NEW_PATIENTS';
  patients: NewPatient[];
};

export type BatchDischargesUpdate = {
  type: 'BATCH_DISCHARGES';
  discharges: DischargePatient[];
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
