import { Patient } from '../types/patient';
import { SortConfig } from '../types/sorting';

export const sortPatients = (patients: Patient[], sortConfig: SortConfig): Patient[] => {
  return [...patients].sort((a, b) => {
    switch (sortConfig.key) {
      case 'id':
      case 'name':
      case 'room':
      case 'gender':
        return sortConfig.direction === 'asc'
          ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
          : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));

      case 'age':
        return sortConfig.direction === 'asc'
          ? a.age - b.age
          : b.age - a.age;

      case 'bloodPressure':
        { const [aSystolic] = a.vitals.bloodPressure.split('/').map(Number);
        const [bSystolic] = b.vitals.bloodPressure.split('/').map(Number);
        return sortConfig.direction === 'asc'
          ? aSystolic - bSystolic
          : bSystolic - aSystolic; }

      case 'heartRate':
        return sortConfig.direction === 'asc'
          ? a.vitals.heartRate - b.vitals.heartRate
          : b.vitals.heartRate - a.vitals.heartRate;

      case 'oxygenLevel':
        return sortConfig.direction === 'asc'
          ? a.vitals.oxygenLevel - b.vitals.oxygenLevel
          : b.vitals.oxygenLevel - a.vitals.oxygenLevel;

      default:
        return 0;
    }
  });
};
