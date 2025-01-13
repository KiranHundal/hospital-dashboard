import { useState, useEffect } from 'react';
import { Patient } from '../types/patient';

export const useSearch = (patients: Patient[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exactSearchTerm, setExactSearchTerm] = useState('');

  useEffect(() => {
    if (exactSearchTerm && searchTerm !== exactSearchTerm) {
      setExactSearchTerm('');
    }
  }, [searchTerm, exactSearchTerm]);

  const filteredPatients = patients.filter((patient) => {
    const match = (value: string | number | undefined) =>
      exactSearchTerm
        ? value?.toString().toLowerCase() === exactSearchTerm
        : value?.toString().toLowerCase().includes(searchTerm);

    return (
      match(patient.id) ||
      match(patient.name) ||
      match(patient.room) ||
      match(patient.gender) ||
      match(patient.age) ||
      match(patient.vitals.bloodPressure) ||
      match(patient.vitals.oxygenLevel) ||
      match(patient.vitals.heartRate)
    );
  });

  return { searchTerm, setSearchTerm, setExactSearchTerm, filteredPatients };
};
