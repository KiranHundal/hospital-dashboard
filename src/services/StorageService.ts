// services/StorageService.ts
import { Patient, VitalSigns } from '../types/patient';
import { SortConfig } from '../types/sorting';
import { FilterCriteria } from '../utils/filterUtils';

interface StorageKeys {
  readonly PATIENTS: string;
  readonly PATIENT: (id: string) => string;
  readonly LAST_UPDATE: string;
  readonly FILTER_CRITERIA: string;
  readonly SORT_CONFIG: string;
  readonly USER_PREFERENCES: string;
}

interface UserPreferences<T = unknown> {
  sortConfig?: SortConfig<T>;
  filterCriteria?: FilterCriteria;
  rowsPerPage?: number;
  theme?: 'light' | 'dark';
}

export class StorageService {
  private static instance: StorageService | null = null;

  private readonly STORAGE_KEYS: StorageKeys = {
    PATIENTS: 'patients',
    PATIENT: (id: string) => `patient-${id}`,
    LAST_UPDATE: 'lastUpdate',
    FILTER_CRITERIA: 'filterCriteria',
    SORT_CONFIG: 'sortConfig',
    USER_PREFERENCES: 'userPreferences'
  };

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic methods
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage: ${key}`, error);
      throw new Error(`Failed to save data: ${error}`);
    }
  }

  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  }

  // Patient-specific methods
  savePatients(patients: Patient[]): void {
    this.setItem(this.STORAGE_KEYS.PATIENTS, patients);
    this.setItem(this.STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
  }

  getPatients(): Patient[] {
    return this.getItem<Patient[]>(this.STORAGE_KEYS.PATIENTS) || [];
  }

  savePatient(patient: Patient): void {
    this.setItem(this.STORAGE_KEYS.PATIENT(patient.id), patient);

    // Update patient in the patients list as well
    const patients = this.getPatients();
    const updatedPatients = patients.map(p =>
      p.id === patient.id ? patient : p
    );
    this.savePatients(updatedPatients);
  }

  getPatient(patientId: string): Patient | null {
    return this.getItem<Patient>(this.STORAGE_KEYS.PATIENT(patientId));
  }

  updatePatientVitals(patientId: string, vitals: Partial<VitalSigns>): Patient | null {
    const patient = this.getPatient(patientId);
    if (!patient) return null;

    const updatedPatient = {
      ...patient,
      vitals: { ...patient.vitals, ...vitals },
      lastUpdated: new Date().toISOString()
    };

    this.savePatient(updatedPatient);
    return updatedPatient;
  }

  // User preferences methods
  saveUserPreferences<T = unknown>(preferences: UserPreferences<T>): void {
    this.setItem<UserPreferences<T>>(this.STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  getUserPreferences<T = unknown>(): UserPreferences<T> {
    return this.getItem<UserPreferences<T>>(this.STORAGE_KEYS.USER_PREFERENCES) || {} as UserPreferences<T>;
  }

  saveSortConfig<T>(sortConfig: SortConfig<T>): void {
    const preferences = this.getUserPreferences<T>();
    preferences.sortConfig = sortConfig;
    this.saveUserPreferences<T>(preferences);
  }

  getSortConfig<T>(): SortConfig<T> | null {
    const preferences = this.getUserPreferences<T>();
    return preferences.sortConfig || null;
  }

  saveFilterCriteria(filterCriteria: FilterCriteria): void {
    const preferences = this.getUserPreferences();
    preferences.filterCriteria = filterCriteria;
    this.saveUserPreferences(preferences);
  }

  getFilterCriteria(): FilterCriteria | undefined {
    const preferences = this.getUserPreferences();
    return preferences.filterCriteria;
  }

  // Cache management methods
  getLastUpdate(): string | null {
    return this.getItem<string>(this.STORAGE_KEYS.LAST_UPDATE);
  }

  clearCache(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      if (typeof key === 'string') {
        this.removeItem(key);
      }
    });
  }

  clearPatientCache(): void {
    this.removeItem(this.STORAGE_KEYS.PATIENTS);
    const patientKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('patient-'));
    patientKeys.forEach(key => this.removeItem(key));
  }
}

export default StorageService;
