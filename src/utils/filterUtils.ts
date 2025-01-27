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
}

export const applyFilters = (patients: Patient[], criteria: FilterCriteria): Patient[] => {
  console.log('Starting filter with criteria:', criteria);
  console.log('All patients before filter:', patients);

  return patients.filter((patient) => {
    if (criteria.recentUpdates) {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      console.log(`Checking patient ${patient.id}:`, {
        lastUpdateTime: patient.lastUpdateTime,
        oneHourAgo,
        isRecent: patient.lastUpdateTime ? patient.lastUpdateTime > oneHourAgo : false,
        timeDiff: patient.lastUpdateTime ? (patient.lastUpdateTime - oneHourAgo) / 1000 + ' seconds' : 'n/a'
      });
      if (!patient.lastUpdateTime || patient.lastUpdateTime < oneHourAgo) {
        return false;
      }
    }

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

      if (!highBP && !lowOxygen && !abnormalHeartRate) {
        return true;
      }

      const bloodPressureParts = patient.vitals.bloodPressure.split('/');
      const systolicBP = bloodPressureParts.length === 2 ? parseInt(bloodPressureParts[0], 10) : null;
      const oxygenLevel = patient.vitals.oxygenLevel;
      const heartRate = patient.vitals.heartRate;

      if (highBP && systolicBP !== null && systolicBP > 140) {
        return true;
      }

      if (lowOxygen && oxygenLevel !== undefined && oxygenLevel < 90) {
        return true;
      }

      if (abnormalHeartRate && heartRate !== undefined && (heartRate < 60 || heartRate > 100)) {
        return true;
      }

      return false;
    }

    return true;
  });
};
