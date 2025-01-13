import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import websocketReducer from './slices/websocketSlice';

export const store = configureStore({
  reducer: {
    patients: patientReducer,
    websocket: websocketReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
