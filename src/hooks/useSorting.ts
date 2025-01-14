import { useState, useMemo, useEffect } from 'react';
import { analyzeVitals } from '../utils/vitalUtils';
import { VitalSigns } from '../types/patient';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  field: keyof T;
  direction: SortDirection;
}

const SORT_KEY = 'user_sort_config';

export const useSorting = <T extends { vitals?: VitalSigns }>(
  data: T[],
  defaultSortField?: keyof T
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(() => {
    const savedConfig = localStorage.getItem(SORT_KEY);
    return savedConfig ? JSON.parse(savedConfig) : defaultSortField ? { field: defaultSortField, direction: 'asc' } : null;
  });

  useEffect(() => {
    if (sortConfig) {
      localStorage.setItem(SORT_KEY, JSON.stringify(sortConfig));
    }
  }, [sortConfig]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { field, direction } = sortConfig;
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...data].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (field === 'room' && typeof aValue === 'string' && typeof bValue === 'string') {
        return multiplier * (parseInt(aValue, 10) - parseInt(bValue, 10));
      }

      if (field === 'vitals') {
        const aSeverity = a.vitals ? analyzeVitals(a.vitals).severityScore : 0;
        const bSeverity = b.vitals ? analyzeVitals(b.vitals).severityScore : 0;

        return multiplier * (bSeverity - aSeverity);
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return multiplier * aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return multiplier * (aValue - bValue);
      }

      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (field: keyof T) => {
    setSortConfig((current) => {
      if (current?.field === field) {
        return { field, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'asc' };
    });
  };
  const resetSorting = () => {
    setSortConfig(null);
    localStorage.removeItem(SORT_KEY);
  };
  return { sortedData, sortConfig, handleSort, resetSorting };
};
