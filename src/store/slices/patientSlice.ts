import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient, WebSocketMessage } from '../../types/patient';

export interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | undefined;
  updatedPatientId: string | undefined;
  lastUpdate: string | undefined;
}

export const initialState: PatientState = {
  patients: [],
  loading: false,
  error: undefined,
  updatedPatientId: undefined,
  lastUpdate: undefined,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setPatients(state, action: PayloadAction<Patient[]>) {
      state.patients = action.payload;
      state.loading = false;
      state.error = undefined;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updatePatient(state, action: PayloadAction<WebSocketMessage>) {
      const { patientId, vitals } = action.payload;
      const patient = state.patients.find((p) => p.id === patientId);
      if (patient) {
        patient.vitals = { ...patient.vitals, ...vitals };
        patient.isUpdated = true;
      }
      state.updatedPatientId = patientId;
      state.lastUpdate = new Date().toISOString();
    },
    clearUpdateHighlight(state) {
      state.updatedPatientId = undefined;
      state.patients.forEach((patient) => {
        patient.isUpdated = false;
      });
    },
  },
});

export const {
  setLoading,
  setPatients,
  setError,
  updatePatient,
  clearUpdateHighlight,
} = patientSlice.actions;

export default patientSlice.reducer;
