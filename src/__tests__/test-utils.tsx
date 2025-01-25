import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor, RenderOptions } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { configureStore, EnhancedStore, Reducer } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RootState } from '../store';
import patientReducer, { PatientState } from '../store/slices/patientSlice';
import websocketReducer, { WebSocketState } from '../store/slices/websocketSlice';

interface ReducerState {
  patients: PatientState;
  websocket: WebSocketState;
}

type AppStore = EnhancedStore<ReducerState>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

const createTestStore = (preloadedState?: Partial<RootState>): AppStore => {
  return configureStore({
    reducer: {
      patients: patientReducer as Reducer<PatientState>,
      websocket: websocketReducer as Reducer<WebSocketState>
    },
    preloadedState: preloadedState as ReducerState
  });
};

const customRender = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
        </Provider>
      </QueryClientProvider>
    );
  }

  return {
    store,
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
  };
};

// Helper function for async events
const waitForNextUpdate = () => act(async () => {
  await new Promise(resolve => setTimeout(resolve, 0));
});

// Re-export testing utilities
export {
  customRender as render,
  createTestStore,
  screen,
  fireEvent,
  userEvent,
  waitFor,
  act,
  waitForNextUpdate
};

export type { AppStore, ReducerState };
