import { Patient } from "../types/patient";

export interface FilterCriteria {
  name?: string;
  ageRange?: [number, number];
  gender?: "male" | "female" | "other";
  room?: string;
  criticalVitals?: {
    highBP?: boolean;
    lowOxygen?: boolean;
    abnormalHeartRate?: boolean;
  };
  recentUpdates?: boolean;
  recentUpdateWindow?: "5min" | "15min" | "1hour";

}

export const applyFilters = (patients: Patient[], criteria: FilterCriteria): Patient[] => {
  return patients.filter((patient) => {
    if (
      criteria.name &&
      !patient.name.toLowerCase().includes(criteria.name.trim().toLowerCase())
    ) {
      return false;
    }

    if (criteria.ageRange) {
      const [minAge, maxAge] = criteria.ageRange;
      if (patient.age < minAge || patient.age > maxAge) {
        return false;
      }
    }

    if (criteria.gender && patient.gender !== criteria.gender) {
      return false;
    }

    if (criteria.room && !patient.room.toLowerCase().includes(criteria.room.toLowerCase())) {
      return false;
    }

    if (criteria.criticalVitals) {
      const { highBP, lowOxygen, abnormalHeartRate } = criteria.criticalVitals;

      const bloodPressureParts = patient.vitals.bloodPressure.split('/');
      const systolicBP = bloodPressureParts.length === 2 ? parseInt(bloodPressureParts[0], 10) : null;
      const oxygenLevel = patient.vitals.oxygenLevel;
      const heartRate = patient.vitals.heartRate;

      if (
        (highBP && systolicBP !== null && systolicBP > 140) ||
        (lowOxygen && oxygenLevel !== undefined && oxygenLevel < 90) ||
        (abnormalHeartRate &&
          heartRate !== undefined &&
          (heartRate < 60 || heartRate > 100))
      ) {
        return true;
      }

      if (highBP || lowOxygen || abnormalHeartRate) {
        return false;
      }
    }
    if (criteria.recentUpdates) {
      const oneHourAgo = Date.now() - (60 * 60 * 1000); 
      console.log('Checking patient:', {
        id: patient.id,
        lastUpdateTime: patient.lastUpdateTime,
        isRecent: patient.lastUpdateTime ? patient.lastUpdateTime > oneHourAgo : false,
        timeDiff: patient.lastUpdateTime ?
          Math.round((Date.now() - patient.lastUpdateTime) / 1000) + ' seconds ago' :
          'never updated'
      });

      if (!patient.lastUpdateTime || patient.lastUpdateTime < oneHourAgo) {
        return false;
      }
    }

    return true;
  });
};
