import { Patient } from '../types/patient';
import { apiService } from './api';
import { patientAdapter } from './patientAdapter';
import { APIError, TransformationError, ValidationError } from '../types/errors';
import { StorageService } from './StorageService';

interface PatientServiceResponse {
  patients: Patient[];
  totalCount: number;
  error?: string;
}

export class PatientService {
  private static instance: PatientService;
  private storage: StorageService;

  private constructor() {
    this.storage = StorageService.getInstance();
  }

  static getInstance(): PatientService {
    if (!PatientService.instance) {
      PatientService.instance = new PatientService();
    }
    return PatientService.instance;
  }

  async fetchPatients(): Promise<PatientServiceResponse> {
    try {
      const cachedData = this.storage.getPatients();
      if (cachedData.length > 0) {
        console.log('Using cached data');
        return {
          patients: cachedData,
          totalCount: cachedData.length
        };
      }

      const { data: posts, statusCode } = await apiService.fetchPosts();
      console.log(`Fetched ${posts.length} posts with status ${statusCode}`);

      const apiPatients = posts.reduce<Patient[]>((validPatients, post) => {
        try {
          const patient = patientAdapter.transformPostToPatient(post);
          validPatients.push(patient);
        } catch (error) {
          console.warn(`Skipping invalid post ${post.id}:`, error);
        }
        return validPatients;
      }, []);

      const allPatients = [...cachedData, ...apiPatients];

      // Remove duplicates if any (based on ID)
      const uniquePatients = Array.from(
        new Map(allPatients.map(patient => [patient.id, patient])).values()
      );

      uniquePatients.sort((a, b) => a.id.localeCompare(b.id));
      this.storage.savePatients(uniquePatients);

      return {
        patients: uniquePatients,
        totalCount: uniquePatients.length
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
      const cachedPatient = this.storage.getPatient(patientId);
      if (cachedPatient) {
        return cachedPatient;
      }

      const { patients } = await this.fetchPatients();
      const patient = patients.find(p => p.id === patientId) || null;
      if (patient) {
        this.storage.savePatient(patient);
      }
      return patient;
    } catch (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
      return null;
    }
  }

  updatePatientVitals(patientId: string, updatedVitals: Partial<Patient['vitals']>): Patient | null {
    return this.storage.updatePatientVitals(patientId, updatedVitals);
  }
}
