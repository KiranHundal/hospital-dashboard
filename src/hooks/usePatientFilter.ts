import { useState, useEffect, useMemo } from 'react';
import { applyFilters, FilterCriteria } from '../utils/filterUtils';
import { Patient } from '../types/patient';

const FILTER_KEY = 'user_filter_criteria';

export const usePatientFilter = (patients: Patient[]) => {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(() => {
    const savedCriteria = localStorage.getItem(FILTER_KEY);
    return savedCriteria ? JSON.parse(savedCriteria) : {};
  });

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify(filterCriteria));
  }, [filterCriteria]);

  const filteredPatients = useMemo(() => {
    return applyFilters(patients, filterCriteria);
  }, [patients, filterCriteria]);

  const resetFilters = () => {
    setFilterCriteria({});
    localStorage.removeItem(FILTER_KEY);
  };

  return { filteredPatients, filterCriteria, setFilterCriteria, resetFilters };
};
