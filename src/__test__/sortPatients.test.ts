import { Patient, Gender } from '../types/patient';
import { sortPatients } from '../utils/sortHelpers';

type SortDirection = 'asc' | 'desc';
interface SortConfig<T> {
  field: keyof T;
  direction: SortDirection;
}

describe('sortPatients', () => {
  const patients: Patient[] = [
    {
      id: 'P0002',
      name: 'Alice',
      age: 30,
      room: '101',
      gender: Gender.Female,
      vitals: {
        bloodPressure: "120/80",
        heartRate: 70,
        oxygenLevel: 98,
        timestamp: 1630000000000,
        isBPHigh: false,
        isBPLow: false,
        isHRHigh: false,
        isHRLow: false,
        isO2Low: false,
        severityScore: 0,
      },
      fallRisk: false,
      isolation: false,
      npo: false,
    },
    {
      id: 'P0001',
      name: 'Bob',
      age: 40,
      room: '102',
      gender: Gender.Male,
      vitals: {
        bloodPressure: "130/85",
        heartRate: 80,
        oxygenLevel: 97,
        timestamp: 1630000000000,
        isBPHigh: false,
        isBPLow: false,
        isHRHigh: false,
        isHRLow: false,
        isO2Low: false,
        severityScore: 0,
      },
      fallRisk: false,
      isolation: false,
      npo: false,
    },
  ];

  it('should sort patients by id ascending', () => {
    const sortConfig: SortConfig<Patient> = { field: 'id', direction: 'asc' };
    const sorted = sortPatients(patients, sortConfig);
    expect(sorted[0].id).toBe('P0001');
    expect(sorted[1].id).toBe('P0002');
  });

  it('should sort patients by name descending', () => {
    const sortConfig: SortConfig<Patient> = { field: 'name', direction: 'desc' };
    const sorted = sortPatients(patients, sortConfig);
    expect(sorted[0].name).toBe('Bob');
    expect(sorted[1].name).toBe('Alice');
  });
});
