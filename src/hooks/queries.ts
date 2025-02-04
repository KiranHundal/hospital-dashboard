import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientService } from '../services/patientService';
import { Patient, VitalSigns } from '../types/patient';

export const QUERY_KEYS = {
  patients: ['patients'] as const,
  patient: (id: string) => ['patient', id] as const,
};

interface QueryError {
  message: string;
  code?: string;
  status?: number;
}

const LOCAL_STORAGE_KEYS = {
  PATIENTS: 'patients',
  PATIENT: (id: string) => `patient-${id}`,
} as const;

export const usePatients = () => {
  return useQuery<Patient[], QueryError>({
    queryKey: QUERY_KEYS.patients,
    queryFn: async () => {
      try {
        const patientService = PatientService.getInstance();
        const { patients, error: apiError } = await patientService.fetchPatients();

        if (apiError) {
          throw new Error(apiError);
        }

        localStorage.setItem(LOCAL_STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
        return patients;
      } catch (err) {
        const queryError: QueryError = {
          message: err instanceof Error ? err.message : 'Failed to fetch patients',
          status: 500
        };
        throw queryError;
      }
    },
    initialData: () => {
      try {
        const storedPatients = localStorage.getItem(LOCAL_STORAGE_KEYS.PATIENTS);

        if (!storedPatients) return [] as Patient[];
        return JSON.parse(storedPatients) as Patient[];
      } catch (err) {
        console.error('Error reading from localStorage:', err);
        return [] as Patient[];
      }
    },
    gcTime: 1000 * 60 * 30,
  });
};

export const usePatient = (patientId: string) => {
  return useQuery<Patient, QueryError>({
    queryKey: QUERY_KEYS.patient(patientId),
    queryFn: async () => {
      try {
        const patientService = PatientService.getInstance();
        const patient = await patientService.getPatientById(patientId);

        if (!patient) {
          throw new Error('Patient not found');
        }

        localStorage.setItem(LOCAL_STORAGE_KEYS.PATIENT(patientId), JSON.stringify(patient));
        return patient;
      } catch (err) {
        const queryError: QueryError = {
          message: err instanceof Error ? err.message : 'Failed to fetch patient',
          status: 404,
          code: 'PATIENT_NOT_FOUND'
        };
        throw queryError;
      }
    },
    initialData: () => {
      try {
        const storedPatient = localStorage.getItem(LOCAL_STORAGE_KEYS.PATIENT(patientId));
        if (!storedPatient) throw new Error('No cached patient data');
        return JSON.parse(storedPatient) as Patient;
      } catch (error) {
        console.error('Error fetching initial patient data:', error);
        throw new Error('Invalid or missing patient data');
      }
    },

    enabled: !!patientId,
  });
};

export const useUpdatePatientVitals = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Patient,
    QueryError,
    { patientId: string; vitals: Partial<VitalSigns> }
  >({
    mutationFn: async ({ patientId, vitals }) => {
      try {
        const patientService = PatientService.getInstance();
        const updatedPatient = patientService.updatePatientVitals(patientId, vitals);

        if (!updatedPatient) {
          throw new Error('Failed to update patient vitals');
        }

        localStorage.setItem(
          LOCAL_STORAGE_KEYS.PATIENT(patientId),
          JSON.stringify(updatedPatient)
        );
        return updatedPatient;
      } catch (err) {
        const queryError: QueryError = {
          message: err instanceof Error ? err.message : 'Failed to update patient vitals',
          status: 500,
          code: 'UPDATE_FAILED'
        };
        throw queryError;
      }
    },
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(
        QUERY_KEYS.patient(updatedPatient.id),
        updatedPatient
      );

      queryClient.setQueryData<Patient[]>(
        QUERY_KEYS.patients,
        (oldData) => {
          if (!oldData) return [updatedPatient];
          return oldData.map((patient) =>
            patient.id === updatedPatient.id ? updatedPatient : patient
          );
        }
      );

      try {
        const patients = queryClient.getQueryData<Patient[]>(QUERY_KEYS.patients);
        if (patients) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
        }
      } catch (err) {
        console.error('Error updating localStorage:', err);
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
