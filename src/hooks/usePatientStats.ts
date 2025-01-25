import { useMemo } from 'react';
import { Patient } from '../types/patient';
import VitalSignsService from '../services/VitalSignsService';

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
    const vitalService = VitalSignsService.getInstance();

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
        const vitalStatus = vitalService.analyzeVitals(patient.vitals);

        if (vitalStatus.isBPHigh) stats.criticalPatients.highBP++;
        if (vitalStatus.isBPLow) stats.criticalPatients.lowBP++;
        if (vitalStatus.isO2Low) stats.criticalPatients.lowO2++;
        if (vitalStatus.isHRHigh) stats.criticalPatients.highHR++;
        if (vitalStatus.isHRLow) stats.criticalPatients.lowHR++;
      });
    }

    return stats;
  }, [patients]);
};
