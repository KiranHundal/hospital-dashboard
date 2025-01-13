// src/store/selectors/patientSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const selectPatientsState = (state: RootState) => state.patients;
export const selectWebSocketState = (state: RootState) => state.websocket;

export const selectPatientsDashboard = createSelector(
  [selectPatientsState, selectWebSocketState],
  (patients, websocket) => ({
    patients: patients.patients,
    loading: patients.loading,
    error: patients.error || undefined,
    updatedPatientId: patients.updatedPatientId || undefined,
    lastUpdate: patients.lastUpdate || undefined, 
    isConnected: websocket.isConnected
  })
);
