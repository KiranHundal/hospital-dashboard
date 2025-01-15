import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queries';

export const useHydrateCache = (queryClient: QueryClient) => {
  useEffect(() => {
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      const patients = JSON.parse(storedPatients);
      console.log('Hydrating cache with patients from localStorage:', patients);

      queryClient.setQueryData(QUERY_KEYS.patients, patients);
      console.log('Cache after hydration:', queryClient.getQueryData(QUERY_KEYS.patients));
    }
  }, [queryClient]);
};
