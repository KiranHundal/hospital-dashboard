// __tests__/utils/mockData.ts
import { Patient, Gender } from '../../types/patient';

export const createMockPatients = (): Patient[] => [
    {
        id: 'P001',
        name: 'John Doe',
        age: 45,
        gender: 'male',
        room: '101',
        vitals: {
          bloodPressure: '120/80',
          heartRate: 75,
          oxygenLevel: 98,
        },
      },
      {
        id: 'P002',
        name: 'Alice Smith',
        age: 30,
        gender: 'female',
        room: '102',
        vitals: {
          bloodPressure: '110/70',
          heartRate: 80,
          oxygenLevel: 99,
        },
      }
    ];

// Utility for creating large mock datasets
export const createLargeMockPatients = (count: number = 1000): Patient[] =>
  Array.from({ length: count }, (_, i): Patient => ({
    id: `P${i.toString().padStart(4, '0')}`,
    name: `Patient ${i}`,
    age: i % 100,
    gender: (i % 2 === 0 ? 'male' : 'female') as Gender,
    room: `${100 + i}`,
    vitals: {
      bloodPressure: `${120 + (i % 20)}/80`,
      heartRate: 70 + (i % 20),
      oxygenLevel: 95 + (i % 5)
    }
  }));
