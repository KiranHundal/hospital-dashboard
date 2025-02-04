import { useCallback } from 'react';
import StorageService from '../services/StorageService';
import { Patient, VitalSigns } from '../types/patient';
import { FilterCriteria } from '../utils/filterUtils';
import { SortConfig } from '../types/sorting';

export const useStorage = () => {
  const storage = StorageService.getInstance();

  const getPatients = useCallback(() => {
    return storage.getPatients();
  }, [storage]);

  const savePatients = useCallback((patients: Patient[]) => {
    storage.savePatients(patients);
  }, [storage]);

  const getPatient = useCallback((patientId: string) => {
    return storage.getPatient(patientId);
  }, [storage]);

  const savePatient = useCallback((patient: Patient) => {
    storage.savePatient(patient);
  }, [storage]);

  const updatePatientVitals = useCallback((patientId: string, vitals: Partial<VitalSigns>) => {
    return storage.updatePatientVitals(patientId, vitals);
  }, [storage]);

  const getSortConfig = useCallback(() => {
    return storage.getSortConfig();
  }, [storage]);

  const saveSortConfig = useCallback((config: SortConfig) => {
    storage.saveSortConfig(config);
  }, [storage]);

  const getFilterCriteria = useCallback(() => {
    return storage.getFilterCriteria();
  }, [storage]);

  const saveFilterCriteria = useCallback((criteria: FilterCriteria) => {
    storage.saveFilterCriteria(criteria);
  }, [storage]);

  const clearCache = useCallback(() => {
    storage.clearCache();
  }, [storage]);

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
