import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../../hooks/useSearch';
import { Patient} from '../../types/patient';
import { createLargeMockPatients, createMockPatients} from '../test-utils/mockData';


const setupUseSearchHook = (patients: Patient[] = createMockPatients()) => {
  const { result } = renderHook(() => useSearch(patients));

  const setSearchTermAndGetResults = (searchTerm: string) => {
    act(() => {
      result.current.setSearchTerm(searchTerm);
    });

    const filteredPatients = result.current.filteredPatients;

    return { filteredPatients };
  };

  const setExactSearchTermAndGetResults = (exactSearchTerm: string) => {
    act(() => {
      result.current.setExactSearchTerm(exactSearchTerm);
    });

    const filteredPatients = result.current.filteredPatients;

    return { filteredPatients };
  };

  return {
    result,
    setSearchTermAndGetResults,
    setExactSearchTermAndGetResults
  };
};



describe('useSearch Hook', () => {
  describe('Default Behavior', () => {
    it('returns all patients when no search term is set', () => {
      const { result } = setupUseSearchHook();

      expect(result.current.filteredPatients).toHaveLength(2);
    });
  });

  describe('Search Functionality', () => {
    it.each([
      { searchTerm: 'john', expectedName: 'John Doe' },
      { searchTerm: 'P001', expectedName: 'John Doe' },
      { searchTerm: 'ALICE', expectedName: 'Alice Smith' },
    ])('filters patients case-insensitively for term "$searchTerm"',
      ({ searchTerm, expectedName }) => {
        const { filteredPatients } = setupUseSearchHook().setSearchTermAndGetResults(searchTerm);

        expect(filteredPatients).toHaveLength(1);
        expect(filteredPatients[0].name).toBe(expectedName);
    });
  });

  describe('Exact Search Functionality', () => {
    it.each([
      {
        exactTerm: '45',
        validator: (patients: Patient[]) =>
          patients.some(patient => patient.age === 45)
      },
      {
        exactTerm: '75',
        validator: (patients: Patient[]) =>
          patients.some(patient => patient.vitals.heartRate === 75)
      }
    ])('handles exact search term "$exactTerm" across all fields',
      ({ exactTerm, validator }) => {
        const { filteredPatients } = setupUseSearchHook().setExactSearchTermAndGetResults(exactTerm);

        expect(filteredPatients.length).toBeGreaterThan(0);
        expect(validator(filteredPatients)).toBe(true);
    });
  });

  describe('Search State Management', () => {
    it('resets exact search when search term changes', () => {
      const { setExactSearchTermAndGetResults, setSearchTermAndGetResults } =
        setupUseSearchHook();

      const { filteredPatients: exactSearchResults } = setExactSearchTermAndGetResults('45');
      expect(exactSearchResults.length).toBeGreaterThan(0);

      const { filteredPatients: searchResults } = setSearchTermAndGetResults('alice');

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].name).toBe('Alice Smith');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles large datasets efficiently', () => {
      const largeMockPatients = createLargeMockPatients();

      const { result } = setupUseSearchHook(largeMockPatients);
      const startTime = performance.now();

      act(() => {
        result.current.setSearchTerm('Patient 5');
      });

      const endTime = performance.now();
      const filteredPatients = result.current.filteredPatients;

      expect(filteredPatients.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('handles empty or null search terms gracefully', () => {
      const { result } = setupUseSearchHook();

      act(() => {
        result.current.setSearchTerm('');
        result.current.setExactSearchTerm('');
      });

      expect(result.current.filteredPatients).toHaveLength(2);
    });
  });
});
