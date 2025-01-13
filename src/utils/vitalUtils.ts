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

  let severityScore = 0;
  if (isBPHigh) severityScore += 2;
  if (isBPLow) severityScore += 2;
  if (isHRHigh) severityScore += 1;
  if (isHRLow) severityScore += 1;
  if (isO2Low) severityScore += 3;

  return {
    isBPHigh,
    isBPLow,
    isHRHigh,
    isHRLow,
    isO2Low,
    severityScore,
    systolic,
    diastolic
  };
};
