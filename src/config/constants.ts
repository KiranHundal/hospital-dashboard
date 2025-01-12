export const CONFIG = {
    API_URL: 'https://jsonplaceholder.typicode.com/posts',
    WEBSOCKET_URL: 'ws://localhost:8080',
    LOCAL_STORAGE_KEY: 'patientData',
    VITAL_SIGNS: {
        NORMAL_BP_RANGE: {
          min: 90,
          max: 120
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
