import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient, VitalSigns} from '../../types/patient';

export interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | undefined;
  updatedPatientId: string | undefined;
  lastUpdate: string | undefined;
}
export interface UpdatePatientPayload {
  patientId: string;
  vitals: Partial<VitalSigns>;
  isUpdated: boolean;
  lastUpdateTime: number;
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
    updatePatient(state, action: PayloadAction<UpdatePatientPayload>) {
      const { patientId, vitals, isUpdated, lastUpdateTime } = action.payload;
      console.log('Reducer: Updating patient', { patientId, lastUpdateTime }); // Debug log

      const patient = state.patients.find((p) => p.id === patientId);
      if (patient) {
        patient.vitals = { ...patient.vitals, ...vitals };
        patient.isUpdated = isUpdated ?? true;
        patient.lastUpdateTime = lastUpdateTime ?? Date.now();
        console.log('Patient after update:', patient); // Debug log
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
