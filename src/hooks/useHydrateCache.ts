import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queries';

export const useHydrateCache = (queryClient: QueryClient) => {
  useEffect(() => {
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      const patients = JSON.parse(storedPatients);

      queryClient.setQueryData(QUERY_KEYS.patients, patients);
    }
  }, [queryClient]);
};
