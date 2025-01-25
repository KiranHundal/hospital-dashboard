import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WebSocketState {
  isConnected: boolean;
  error: string | null;
}

const initialState: WebSocketState = {
  isConnected: false,
  error: null
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isConnected = false;
    },
    clearError(state) {
      state.error = null;
    }
  }
});

export const { setConnected, setError, clearError } = websocketSlice.actions;
export default websocketSlice.reducer;
