import { useMemo } from 'react';
import { Patient } from '../types/patient';
import { VITAL_THRESHOLDS } from '../config/constants';

export interface PatientStats {
  totalPatients: number;
  genderDistribution: {
    male: number;
    female: number;
  };
  averageAge: number;
  criticalPatients: {
    highBP: number;
    lowBP: number;
    lowO2: number;
    highHR: number;
    lowHR: number;
  };
}

export const usePatientStats = (patients: Patient[]): PatientStats => {
  return useMemo(() => {
    const stats: PatientStats = {
      totalPatients: patients.length,
      genderDistribution: {
        male: patients.filter(p => p.gender === 'male').length,
        female: patients.filter(p => p.gender === 'female').length
      },
      averageAge: 0,
      criticalPatients: {
        highBP: 0,
        lowBP: 0,
        lowO2: 0,
        highHR: 0,
        lowHR: 0
      }
    };

    if (patients.length > 0) {
      stats.averageAge = Math.round(
        patients.reduce((sum, p) => sum + p.age, 0) / patients.length
      );

      patients.forEach(patient => {
        const [systolic, diastolic] = patient.vitals.bloodPressure
          .split('/')
          .map(Number);

        if (systolic > VITAL_THRESHOLDS.BLOOD_PRESSURE.SYSTOLIC.HIGH ||
            diastolic > VITAL_THRESHOLDS.BLOOD_PRESSURE.DIASTOLIC.HIGH) {
          stats.criticalPatients.highBP++;
        }

        if (systolic < VITAL_THRESHOLDS.BLOOD_PRESSURE.SYSTOLIC.LOW ||
            diastolic < VITAL_THRESHOLDS.BLOOD_PRESSURE.DIASTOLIC.LOW) {
          stats.criticalPatients.lowBP++;
        }

        if (patient.vitals.oxygenLevel < VITAL_THRESHOLDS.OXYGEN_LEVEL.LOW) {
          stats.criticalPatients.lowO2++;
        }

        if (patient.vitals.heartRate > VITAL_THRESHOLDS.HEART_RATE.HIGH) {
          stats.criticalPatients.highHR++;
        }
        if (patient.vitals.heartRate < VITAL_THRESHOLDS.HEART_RATE.LOW) {
          stats.criticalPatients.lowHR++;
        }
      });
    }

    return stats;
  }, [patients]);
};
