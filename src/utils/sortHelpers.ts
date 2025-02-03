import { Patient } from '../types/patient';
import { SortConfig } from '../types/sorting';
import VitalSignsService from '../services/VitalSignsService';


export const sortPatients = <T extends Patient>(
  patients: T[],
  sortConfig: SortConfig<T>
): T[] => {
  return [...patients].sort((a, b) => {
    switch (sortConfig.field) {
      case 'id':
      case 'name':
      case 'room':
      case 'gender':
        return sortConfig.direction === 'asc'
          ? String(a[sortConfig.field]).localeCompare(String(b[sortConfig.field]))
          : String(b[sortConfig.field]).localeCompare(String(a[sortConfig.field]));

      case 'age':
        return sortConfig.direction === 'asc'
          ? a.age - b.age
          : b.age - a.age;

      case 'bloodPressure': {
        const [aSystolic] = a.vitals.bloodPressure.split('/').map(Number);
        const [bSystolic] = b.vitals.bloodPressure.split('/').map(Number);
        return sortConfig.direction === 'asc'
          ? aSystolic - bSystolic
          : bSystolic - aSystolic;
      }

      case 'heartRate':
        return sortConfig.direction === 'asc'
          ? a.vitals.heartRate - b.vitals.heartRate
          : b.vitals.heartRate - a.vitals.heartRate;

      case 'oxygenLevel':
        return sortConfig.direction === 'asc'
          ? a.vitals.oxygenLevel - b.vitals.oxygenLevel
          : b.vitals.oxygenLevel - a.vitals.oxygenLevel;

      case 'vitals': {
        const vitalService = VitalSignsService.getInstance();
        const aStatus = vitalService.analyzeVitals(a.vitals);
        const bStatus = vitalService.analyzeVitals(b.vitals);
        return sortConfig.direction === 'asc'
          ? bStatus.severityScore - aStatus.severityScore
          : aStatus.severityScore - bStatus.severityScore;
      }

      default:
        return 0;
    }
  });
};
