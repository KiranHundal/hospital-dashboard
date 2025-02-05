import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../hooks/useSearch';
import { createPatientFixtures } from './utils/patientTestUtils';

describe('useSearch hook', () => {
  const patients = createPatientFixtures([
    { name: 'Alice Smith', id: 'P0001', room: '101' },
    { name: 'Bob Johnson', id: 'P0002', room: '102' },
    { name: 'Carol Williams', id: 'P0003', room: '103' }
  ]);

  it('filters patients by full name case-insensitively', () => {
    const { result } = renderHook(() => useSearch(patients));

    act(() => {
      result.current.setSearchTerm('ALICE');
    });

    expect(result.current.filteredPatients).toHaveLength(1);
    expect(result.current.filteredPatients[0].name).toBe('Alice Smith');
  });

  it('filters patients by partial name', () => {
    const { result } = renderHook(() => useSearch(patients));

    act(() => {
      result.current.setSearchTerm('johnson');
    });

    expect(result.current.filteredPatients).toHaveLength(1);
    expect(result.current.filteredPatients[0].name).toBe('Bob Johnson');
  });

  it('filters patients by room number', () => {
    const { result } = renderHook(() => useSearch(patients));

    act(() => {
      result.current.setSearchTerm('102');
    });

    expect(result.current.filteredPatients).toHaveLength(1);
    expect(result.current.filteredPatients[0].room).toBe('102');
  });

  it('handles empty search term', () => {
    const { result } = renderHook(() => useSearch(patients));

    act(() => {
      result.current.setSearchTerm('');
    });

    expect(result.current.filteredPatients).toHaveLength(3);
  });

  it('returns empty array for non-matching search', () => {
    const { result } = renderHook(() => useSearch(patients));

    act(() => {
      result.current.setSearchTerm('Nonexistent');
    });

    expect(result.current.filteredPatients).toHaveLength(0);
  });
});
