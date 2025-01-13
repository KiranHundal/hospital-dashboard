import { useState, useMemo } from 'react';
import { applyFilters, FilterCriteria } from '../utils/filterUtils';
import { Patient } from '../types/patient';

export const usePatientFilter = (patients: Patient[]) => {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});

  const filteredPatients = useMemo(() => {
    return applyFilters(patients, filterCriteria);
  }, [patients, filterCriteria]);

  return { filteredPatients, filterCriteria, setFilterCriteria };
};
