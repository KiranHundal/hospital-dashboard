import { ConfigService } from '../services/ConfigService';

const config = ConfigService.getInstance().getConfig();
console.log("Loaded Config:", config);
console.log("API_URL:", config.API_URL);

export const VITAL_THRESHOLDS = config.VITALS;
export const UI_CONFIG = config.UI;
export const WEBSOCKET_CONFIG = config.WEBSOCKET;
export const API_URL = config.API_URL;
