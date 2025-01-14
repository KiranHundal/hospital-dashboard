import { VitalSigns } from '../types/patient';
import { VITAL_THRESHOLDS } from '../config/constants';

export const analyzeVitals = (vitals: VitalSigns) => {
  const [systolic, diastolic] = vitals.bloodPressure.split('/').map(Number);
  const isBPHigh = systolic > VITAL_THRESHOLDS.BLOOD_PRESSURE.SYSTOLIC.HIGH ||
                   diastolic > VITAL_THRESHOLDS.BLOOD_PRESSURE.DIASTOLIC.HIGH;
  const isBPLow = systolic < VITAL_THRESHOLDS.BLOOD_PRESSURE.SYSTOLIC.LOW ||
                  diastolic < VITAL_THRESHOLDS.BLOOD_PRESSURE.DIASTOLIC.LOW;

  const isHRHigh = vitals.heartRate > VITAL_THRESHOLDS.HEART_RATE.HIGH;
  const isHRLow = vitals.heartRate < VITAL_THRESHOLDS.HEART_RATE.LOW;

  const isO2Low = vitals.oxygenLevel < VITAL_THRESHOLDS.OXYGEN_LEVEL.LOW;

  const bpSeverity = (isBPHigh || isBPLow) ? 2 : 0;
  const hrSeverity = (isHRHigh || isHRLow) ? 1 : 0;
  const o2Severity = isO2Low ? 3 : 0;

  const severityScore = bpSeverity + hrSeverity + o2Severity;

  const getHighestSeverity = () => {
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
    diastolic
  };
};
