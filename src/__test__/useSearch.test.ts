import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../hooks/useSearch';
import { Patient, Gender } from '../types/patient';

describe('useSearch hook', () => {
  const patients: Patient[] = [
    {
      id: 'P0001',
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
      id: 'P0002',
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

  it('should filter patients based on search term', () => {
    const { result } = renderHook(() => useSearch(patients));

    expect(result.current.filteredPatients).toHaveLength(2);

    act(() => {
      result.current.setSearchTerm('alice');
    });

    expect(result.current.filteredPatients).toHaveLength(1);
    expect(result.current.filteredPatients[0].name).toBe('Alice');

    act(() => {
      result.current.setSearchTerm('');
    });
    expect(result.current.filteredPatients).toHaveLength(2);
  });
});
