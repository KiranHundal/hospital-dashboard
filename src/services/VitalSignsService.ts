import { VitalSigns } from '../types/patient';
import { VITAL_THRESHOLDS } from '../config/constants';

export interface VitalStatus {
  isBPHigh: boolean;
  isBPLow: boolean;
  isHRHigh: boolean;
  isHRLow: boolean;
  isO2Low: boolean;
  severityScore: number;
  bpSeverity: number;
  hrSeverity: number;
  o2Severity: number;
  getHighestSeverity: () => 'bloodPressure' | 'heartRate' | 'oxygenLevel';
  systolic: number;
  diastolic: number;
}

export class VitalSignsService {
  private static instance: VitalSignsService | null = null;

  private constructor() {}

  static getInstance(): VitalSignsService {
    if (!VitalSignsService.instance) {
      VitalSignsService.instance = new VitalSignsService();
    }
    return VitalSignsService.instance;
  }

  analyzeVitals(vitals: VitalSigns): VitalStatus {
    const [systolic, diastolic] = this.parseBP(vitals.bloodPressure);

    const isBPHigh =
      systolic > VITAL_THRESHOLDS.BLOOD_PRESSURE.SYSTOLIC.HIGH ||
      diastolic > VITAL_THRESHOLDS.BLOOD_PRESSURE.DIASTOLIC.HIGH;
    const isBPLow =
      systolic < VITAL_THRESHOLDS.BLOOD_PRESSURE.SYSTOLIC.LOW ||
      diastolic < VITAL_THRESHOLDS.BLOOD_PRESSURE.DIASTOLIC.LOW;

    const isHRHigh = vitals.heartRate > VITAL_THRESHOLDS.HEART_RATE.HIGH;
    const isHRLow = vitals.heartRate < VITAL_THRESHOLDS.HEART_RATE.LOW;
    const isO2Low = vitals.oxygenLevel < VITAL_THRESHOLDS.OXYGEN_LEVEL.LOW;

    const bpSeverity = (isBPHigh || isBPLow) ? 2 : 0;
    const hrSeverity = (isHRHigh || isHRLow) ? 1 : 0;
    const o2Severity = isO2Low ? 3 : 0;
    const severityScore = bpSeverity + hrSeverity + o2Severity;

    const getHighestSeverity = (): 'bloodPressure' | 'heartRate' | 'oxygenLevel' => {
      if (o2Severity > bpSeverity && o2Severity > hrSeverity) return 'oxygenLevel';
      if (bpSeverity > hrSeverity) return 'bloodPressure';
      return 'heartRate';
    };

    return {
      isBPHigh,
      isBPLow,
      isHRHigh,
      isHRLow,
      isO2Low,
      severityScore,
      bpSeverity,
      hrSeverity,
      o2Severity,
      getHighestSeverity,
      systolic,
      diastolic,
    };
  }

  private parseBP(bloodPressure: string): [number, number] {
    const parts = bloodPressure.split('/');
    const systolic = parseInt(parts[0], 10);
    const diastolic = parseInt(parts[1], 10);
    return [systolic, diastolic];
  }
}

export default VitalSignsService;
