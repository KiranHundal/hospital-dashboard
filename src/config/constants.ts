export const CONFIG = {
    API_URL: 'https://jsonplaceholder.typicode.com/posts',
    WEBSOCKET_URL: 'ws://localhost:8080',
    LOCAL_STORAGE_KEY: 'patientData',
    VITAL_SIGNS: {
        NORMAL_BP_RANGE: {
          min: 90,
          max: 140
        },
        NORMAL_HR_RANGE: {
          min: 60,
          max: 100
        },
        NORMAL_O2_RANGE: {
          min: 95,
          max: 100
        }
      }
    } as const;
export const VITAL_THRESHOLDS = {
    BLOOD_PRESSURE: {
      SYSTOLIC: {
        HIGH: 140,
        LOW: 90
      },
      DIASTOLIC: {
        HIGH: 90,
        LOW: 60
      }
    },
    HEART_RATE: {
      HIGH: 100,
      LOW: 60
    },
    OXYGEN_LEVEL: {
      LOW: 95
    }
  } as const;

  export const WEBSOCKET_CONFIG = {
    URL: 'ws://localhost:8080',
    RECONNECT_INTERVAL: 3000,
    MAX_RECONNECT_ATTEMPTS: 5
  } as const;

  export const UI_CONFIG = {
    HIGHLIGHT_DURATION: 2000,
    GRID_BREAKPOINTS: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 4
    }
  } as const;

  export const LOCAL_STORAGE_KEYS = {
    PATIENT_DATA: 'patientData',
    LAST_UPDATE: 'lastUpdate',
    USER_PREFERENCES: 'userPreferences'
  } as const;
