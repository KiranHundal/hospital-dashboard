import { Patient } from '../types/patient';
import { sortPatients } from '../utils/sortHelpers';
import { createPatientFixtures } from './utils/patientTestUtils';

describe('sortPatients', () => {
  const patients = createPatientFixtures([
    { id: 'P0002', name: 'Alice', age: 30, room: '101' },
    { id: 'P0001', name: 'Bob', age: 40, room: '102' }
  ]);

  describe('Sorting by different fields', () => {
    it('sorts patients by id in ascending order', () => {
      const sorted = sortPatients(patients, { field: 'id', direction: 'asc' });
      expect(sorted[0].id).toBe('P0001');
      expect(sorted[1].id).toBe('P0002');
    });

    it('sorts patients by id in descending order', () => {
      const sorted = sortPatients(patients, { field: 'id', direction: 'desc' });
      expect(sorted[0].id).toBe('P0002');
      expect(sorted[1].id).toBe('P0001');
    });

    it('sorts patients by name in descending order', () => {
      const sorted = sortPatients(patients, { field: 'name', direction: 'desc' });
      expect(sorted[0].name).toBe('Bob');
      expect(sorted[1].name).toBe('Alice');
    });

    it('sorts patients by age in ascending order', () => {
      const sorted = sortPatients(patients, { field: 'age', direction: 'asc' });
      expect(sorted[0].age).toBe(30);
      expect(sorted[1].age).toBe(40);
    });
  });

  describe('Edge cases', () => {
    it('handles sorting with empty array', () => {
      const emptyPatients: Patient[] = [];
      const sorted = sortPatients(emptyPatients, { field: 'id', direction: 'asc' });
      expect(sorted).toHaveLength(0);
    });

    it('handles sorting with single patient', () => {
      const singlePatientArray = createPatientFixtures([{ id: 'P0003' }]);
      const sorted = sortPatients(singlePatientArray, { field: 'id', direction: 'asc' });
      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe('P0003');
    });
  });
});
