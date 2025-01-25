import { useMemo } from 'react';
import { VitalSigns } from '../types/patient';
import VitalSignsService from '../services/VitalSignsService';

export const useVitalSigns = (vitals: VitalSigns) => {
  const vitalService = VitalSignsService.getInstance();
  return useMemo(() => vitalService.analyzeVitals(vitals), [vitals]);
};

export default useVitalSigns;
