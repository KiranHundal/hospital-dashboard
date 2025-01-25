import { useCallback } from 'react';
import StorageService from '../services/StorageService';
import { Patient, VitalSigns } from '../types/patient';
import { FilterCriteria } from '../utils/filterUtils';
import { SortConfig } from '../types/sorting';

export const useStorage = () => {
  const storage = StorageService.getInstance();

  const getPatients = useCallback(() => {
    return storage.getPatients();
  }, []);

  const savePatients = useCallback((patients: Patient[]) => {
    storage.savePatients(patients);
  }, []);

  const getPatient = useCallback((patientId: string) => {
    return storage.getPatient(patientId);
  }, []);

  const savePatient = useCallback((patient: Patient) => {
    storage.savePatient(patient);
  }, []);

  const updatePatientVitals = useCallback((patientId: string, vitals: Partial<VitalSigns>) => {
    return storage.updatePatientVitals(patientId, vitals);
  }, []);

  const getSortConfig = useCallback(() => {
    return storage.getSortConfig();
  }, []);

  const saveSortConfig = useCallback((config: SortConfig) => {
    storage.saveSortConfig(config);
  }, []);

  const getFilterCriteria = useCallback(() => {
    return storage.getFilterCriteria();
  }, []);

  const saveFilterCriteria = useCallback((criteria: FilterCriteria) => {
    storage.saveFilterCriteria(criteria);
  }, []);

  const clearCache = useCallback(() => {
    storage.clearCache();
  }, []);

  return {
    getPatients,
    savePatients,
    getPatient,
    savePatient,
    updatePatientVitals,
    getSortConfig,
    saveSortConfig,
    getFilterCriteria,
    saveFilterCriteria,
    clearCache
  };
};

export default useStorage;
