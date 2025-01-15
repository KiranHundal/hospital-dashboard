import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientService } from '../services/patientService';
import { Patient, VitalSigns } from '../types/patient';

export const QUERY_KEYS = {
  patients: ['patients'],
  patient: (id: string) => ['patient', id],
};

export const usePatients = () => {
    return useQuery({
      queryKey: QUERY_KEYS.patients,
      queryFn: async () => {
        const patientService = PatientService.getInstance();
        const { patients, error } = await patientService.fetchPatients();
        if (error) throw new Error(error);

        localStorage.setItem('patients', JSON.stringify(patients));
        return patients;
      },
      initialData: () => {
        const storedPatients = localStorage.getItem('patients');
        return storedPatients ? JSON.parse(storedPatients) : undefined;
      },
    });
  };


export const usePatient = (patientId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.patient(patientId),
    queryFn: async () => {
      const patientService = PatientService.getInstance();
      const patient = await patientService.getPatientById(patientId);
      if (!patient) throw new Error('Patient not found');
      return patient;
    },
    enabled: !!patientId,
  });
};

export const useUpdatePatientVitals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      vitals,
    }: {
      patientId: string;
      vitals: Partial<VitalSigns>;
    }) => {
      const patientService = PatientService.getInstance();
      const updatedPatient = patientService.updatePatientVitals(patientId, vitals);
      if (!updatedPatient) throw new Error('Failed to update patient vitals');
      return updatedPatient;
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
    },
  });
};
