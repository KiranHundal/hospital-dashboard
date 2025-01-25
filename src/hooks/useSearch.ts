import { useState, useEffect, useMemo } from 'react';
import { Patient } from '../types/patient';

export const useSearch = (patients: Patient[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exactSearchTerm, setExactSearchTerm] = useState('');

  useEffect(() => {
    if (exactSearchTerm && searchTerm !== exactSearchTerm) {
      setExactSearchTerm('');
    }
  }, [searchTerm, exactSearchTerm]);

  const filteredPatients = useMemo(() => {
    const searchValue = searchTerm.toLowerCase();
    const exact = exactSearchTerm.toLowerCase();

    return patients.filter((patient) => {
      if (exact) {
        return Object.values(patient).some(value =>
          String(value).toLowerCase() === exact
        ) || (
          patient.vitals && Object.values(patient.vitals).some(value =>
            String(value).toLowerCase() === exact
          )
        );
      }

      const match = (value: any) =>
        String(value).toLowerCase().includes(searchValue);

      return (
        match(patient.id) ||
        match(patient.name) ||
        match(patient.room) ||
        match(patient.gender) ||
        match(patient.age) ||
        match(patient.vitals.bloodPressure) ||
        match(patient.vitals.heartRate) ||
        match(patient.vitals.oxygenLevel)
      );
    });
  }, [patients, searchTerm, exactSearchTerm]);

  return { searchTerm, setSearchTerm, setExactSearchTerm, filteredPatients };
};
