// services/VitalSignsService.ts
import { VitalSigns } from '../types/patient';
import { VITAL_THRESHOLDS } from '../config/constants';

export interface VitalStatus {
  isBPHigh: boolean;
  isBPLow: boolean;
  isHRHigh: boolean;
  isHRLow: boolean;
  isO2Low: boolean;
  severityScore: number;
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

    const isBPHigh = systolic > VITAL_THRESHOLDS.BLOOD_PRESSURE.SYSTOLIC.HIGH ||
                     diastolic > VITAL_THRESHOLDS.BLOOD_PRESSURE.DIASTOLIC.HIGH;
    const isBPLow = systolic < VITAL_THRESHOLDS.BLOOD_PRESSURE.SYSTOLIC.LOW ||
                    diastolic < VITAL_THRESHOLDS.BLOOD_PRESSURE.DIASTOLIC.LOW;

    const isHRHigh = vitals.heartRate > VITAL_THRESHOLDS.HEART_RATE.HIGH;
    const isHRLow = vitals.heartRate < VITAL_THRESHOLDS.HEART_RATE.LOW;
    const isO2Low = vitals.oxygenLevel < VITAL_THRESHOLDS.OXYGEN_LEVEL.LOW;

    return {
      isBPHigh,
      isBPLow,
      isHRHigh,
      isHRLow,
      isO2Low,
      severityScore: this.calculateSeverityScore(isBPHigh, isBPLow, isHRHigh, isHRLow, isO2Low),
      systolic,
      diastolic
    };
  }

  private parseBP(bloodPressure: string): [number, number] {
    const [systolic, diastolic] = bloodPressure.split('/').map(Number);
    return [systolic, diastolic];
  }

  private calculateSeverityScore(
    isBPHigh: boolean,
    isBPLow: boolean,
    isHRHigh: boolean,
    isHRLow: boolean,
    isO2Low: boolean
  ): number {
    const bpScore = (isBPHigh || isBPLow) ? 2 : 0;
    const hrScore = (isHRHigh || isHRLow) ? 1 : 0;
    const o2Score = isO2Low ? 3 : 0;
    return bpScore + hrScore + o2Score;
  }

  isCritical(vitals: VitalSigns): boolean {
    const status = this.analyzeVitals(vitals);
    return status.severityScore > 0;
  }

  getMostCriticalSystem(vitals: VitalSigns): 'bloodPressure' | 'heartRate' | 'oxygenLevel' | null {
    const status = this.analyzeVitals(vitals);
    if (status.severityScore === 0) return null;

    const scores = {
      bloodPressure: (status.isBPHigh || status.isBPLow) ? 2 : 0,
      heartRate: (status.isHRHigh || status.isHRLow) ? 1 : 0,
      oxygenLevel: status.isO2Low ? 3 : 0
    };

    return Object.entries(scores)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as 'bloodPressure' | 'heartRate' | 'oxygenLevel';
  }
}

export default VitalSignsService;
