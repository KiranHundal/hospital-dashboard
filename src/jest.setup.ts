global.WebSocket = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  onopen: null,
  onmessage: null,
  onclose: null,
  onerror: null,
  send: jest.fn(),
  close: jest.fn(),
  readyState: 0,
})) as unknown as typeof WebSocket;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

process.env.VITE_VITAL_BP_SYSTOLIC_HIGH = '140';
process.env.VITE_VITAL_BP_SYSTOLIC_LOW = '90';
process.env.VITE_VITAL_BP_DIASTOLIC_HIGH = '90';
process.env.VITE_VITAL_BP_DIASTOLIC_LOW = '60';
process.env.VITE_VITAL_HR_HIGH = '100';
process.env.VITE_VITAL_HR_LOW = '60';
process.env.VITE_VITAL_O2_LOW = '95';
process.env.VITE_UI_GRID_MOBILE = '1';
process.env.VITE_UI_GRID_TABLET = '2';
process.env.VITE_UI_GRID_DESKTOP = '4';
process.env.VITE_UI_HIGHLIGHT_DURATION = '2000';
process.env.VITE_UI_FADE_DURATION = '500';
process.env.VITE_WEBSOCKET_URL = 'ws://localhost:8080';
process.env.VITE_WEBSOCKET_RECONNECT_INTERVAL = '3000';
process.env.VITE_WEBSOCKET_MAX_RECONNECT_ATTEMPTS = '5';
process.env.VITE_API_URL = 'https://jsonplaceholder.typicode.com/posts';
