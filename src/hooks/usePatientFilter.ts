import { useState, useEffect, useMemo } from 'react';
import { applyFilters, FilterCriteria } from '../utils/filterUtils';
import { Patient } from '../types/patient';
import { StorageService } from '../services/StorageService';

export const usePatientFilter = (patients: Patient[]) => {
  const storage = StorageService.getInstance();

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(() =>
    storage.getFilterCriteria() || {}
  );

  useEffect(() => {
    storage.saveFilterCriteria(filterCriteria);
  }, [filterCriteria]);

  const filteredPatients = useMemo(() => {
    return applyFilters(patients, filterCriteria);
  }, [patients, filterCriteria]);

  const resetFilters = () => {
    setFilterCriteria({});
    storage.saveFilterCriteria({});
  };

  return { filteredPatients, filterCriteria, setFilterCriteria, resetFilters };
};
