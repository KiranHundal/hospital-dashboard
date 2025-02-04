interface VitalThresholds {
  BLOOD_PRESSURE: {
    SYSTOLIC: { HIGH: number; LOW: number };
    DIASTOLIC: { HIGH: number; LOW: number };
  };
  HEART_RATE: { HIGH: number; LOW: number };
  OXYGEN_LEVEL: { LOW: number };
}

interface UIConfig {
  GRID_BREAKPOINTS: {
    MOBILE: number;
    TABLET: number;
    DESKTOP: number;
  };
  ANIMATIONS: {
    HIGHLIGHT_DURATION: number;
    FADE_DURATION: number;
  };
}

interface WebSocketConfig {
  URL: string;
  RECONNECT_INTERVAL: number;
  MAX_RECONNECT_ATTEMPTS: number;
}

interface AppConfig {
  VITALS: VitalThresholds;
  UI: UIConfig;
  WEBSOCKET: WebSocketConfig;
  API_URL: string;
}

export class ConfigService {
  private static instance: ConfigService | null = null;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

private loadConfig(): AppConfig {
  const env = (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID !== undefined)
    ? process.env
    : (() => {
        try {
          return eval("import.meta.env");
        } catch (_) {
          return {};
        }
      })();

  return {
    VITALS: {
      BLOOD_PRESSURE: {
        SYSTOLIC: {
          HIGH: Number(env.VITE_VITAL_BP_SYSTOLIC_HIGH) || 140,
          LOW: Number(env.VITE_VITAL_BP_SYSTOLIC_LOW) || 90,
        },
        DIASTOLIC: {
          HIGH: Number(env.VITE_VITAL_BP_DIASTOLIC_HIGH) || 90,
          LOW: Number(env.VITE_VITAL_BP_DIASTOLIC_LOW) || 60,
        },
      },
      HEART_RATE: {
        HIGH: Number(env.VITE_VITAL_HR_HIGH) || 100,
        LOW: Number(env.VITE_VITAL_HR_LOW) || 60,
      },
      OXYGEN_LEVEL: {
        LOW: Number(env.VITE_VITAL_O2_LOW) || 95,
      },
    },
    UI: {
      GRID_BREAKPOINTS: {
        MOBILE: Number(env.VITE_UI_GRID_MOBILE) || 1,
        TABLET: Number(env.VITE_UI_GRID_TABLET) || 2,
        DESKTOP: Number(env.VITE_UI_GRID_DESKTOP) || 4,
      },
      ANIMATIONS: {
        HIGHLIGHT_DURATION: Number(env.VITE_UI_HIGHLIGHT_DURATION) || 2000,
        FADE_DURATION: Number(env.VITE_UI_FADE_DURATION) || 500,
      },
    },
    WEBSOCKET: {
      URL: env.VITE_WEBSOCKET_URL || 'ws://localhost:8080',
      RECONNECT_INTERVAL: Number(env.VITE_WEBSOCKET_RECONNECT_INTERVAL) || 3000,
      MAX_RECONNECT_ATTEMPTS: Number(env.VITE_WEBSOCKET_MAX_RECONNECT_ATTEMPTS) || 5,
    },
    API_URL: env.VITE_API_URL || 'https://jsonplaceholder.typicode.com/posts',
  };
}




  getConfig(): AppConfig {
    return this.config;
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }
}
