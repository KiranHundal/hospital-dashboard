import { Patient } from '../types/patient';
import { apiService } from './api';
import { patientAdapter } from './patientAdapter';
import { APIError, TransformationError, ValidationError } from '../types/errors';

interface PatientServiceResponse {
  patients: Patient[];
  totalCount: number;
  error?: string;
}

export class PatientService {
  private static instance: PatientService;

  private constructor() {}

  static getInstance(): PatientService {
    if (!PatientService.instance) {
      PatientService.instance = new PatientService();
    }
    return PatientService.instance;
  }

  async fetchPatients(): Promise<PatientServiceResponse> {
    try {
        const cachedData = this.getCachedPatients();
        if (cachedData) {
          console.log('Using cached data');
          return {
            patients: cachedData,
            totalCount: cachedData.length
          };
        }


      const { data: posts, statusCode } = await apiService.fetchPosts();
      console.log(`Fetched ${posts.length} posts with status ${statusCode}`);

      const patients = posts.reduce<Patient[]>((validPatients, post) => {
        try {
          const patient = patientAdapter.transformPostToPatient(post);
          validPatients.push(patient);
        } catch (error) {
          console.warn(`Skipping invalid post ${post.id}:`, error);
        }
        return validPatients;
      }, []);

      patients.sort((a, b) => a.id.localeCompare(b.id));
      this.persistPatientsToCache(patients);


      return {
        patients,
        totalCount: patients.length
      };
    } catch (error) {
      let errorMessage = 'An unknown error occurred';

      if (error instanceof APIError) {
        errorMessage = `API Error: ${error.message}`;
      } else if (error instanceof TransformationError) {
        errorMessage = `Transformation Error: ${error.message}`;
      } else if (error instanceof ValidationError) {
        errorMessage = `Validation Error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error in patient service:', errorMessage);

      return {
        patients: [],
        totalCount: 0,
        error: errorMessage
      };
    }
  }

  async getPatientById(patientId: string): Promise<Patient | null> {
    try {
      const { patients } = await this.fetchPatients();
      return patients.find(patient => patient.id === patientId) || null;
    } catch (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
      return null;
    }
  }

  persistPatientsToCache(patients: Patient[]): void {
    try {
      localStorage.setItem('patientData', JSON.stringify(patients));
      localStorage.setItem('lastUpdate', new Date().toISOString());
    } catch (error) {
      console.error('Error persisting patients to cache:', error);
    }
  }

  getCachedPatients(): Patient[] | null {
    try {
      const cached = localStorage.getItem('patientData');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  updatePatientVitals(patientId: string, updatedVitals: Partial<Patient['vitals']>): Patient | null {
    try {
      const patients = this.getCachedPatients();
      if (!patients) return null;

      const updatedPatients = patients.map(patient => {
        if (patient.id === patientId) {
          return {
            ...patient,
            vitals: { ...patient.vitals, ...updatedVitals }
          };
        }
        return patient;
      });

      this.persistPatientsToCache(updatedPatients);
      return updatedPatients.find(p => p.id === patientId) || null;
    } catch (error) {
      console.error(`Error updating vitals for patient ${patientId}:`, error);
      return null;
    }
  }
}
