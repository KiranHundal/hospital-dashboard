import { ConfigService } from '../services/ConfigService';

const config = ConfigService.getInstance().getConfig();

export const VITAL_THRESHOLDS = config.VITALS;
export const UI_CONFIG = config.UI;
export const WEBSOCKET_CONFIG = config.WEBSOCKET;
export const API_URL = config.API_URL;
