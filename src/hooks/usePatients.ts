// import { useState, useCallback, useEffect } from 'react';
// import { Patient, WebSocketMessage } from '../types/patient';
// import { PatientService } from '../services/patientService';

// export const usePatients = () => {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [updatedPatientId, setUpdatedPatientId] = useState<string>();
//   const [lastUpdate, setLastUpdate] = useState<string>();

//   useEffect(() => {
//     const loadPatients = async () => {
//       try {
//         setLoading(true);
//         const patientService = PatientService.getInstance();
//         const { patients: loadedPatients, error: serviceError } =
//           await patientService.fetchPatients();

//         if (serviceError) {
//           setError(serviceError);
//         } else {
//           setPatients(loadedPatients);
//           patientService.persistPatientsToCache(loadedPatients);
//         }
//       } catch (err) {
//         setError('Failed to load patients');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPatients();
//   }, []);

//   const handlePatientUpdate = useCallback((message: WebSocketMessage) => {
//     const patientService = PatientService.getInstance();
//     const updatedPatient = patientService.updatePatientVitals(
//       message.patientId,
//       message.vitals
//     );

//     if (updatedPatient) {
//       setPatients(currentPatients =>
//         currentPatients.map(patient =>
//           patient.id === message.patientId ? updatedPatient : patient
//         )
//       );
//       setUpdatedPatientId(message.patientId);
//       setLastUpdate(new Date().toLocaleTimeString());

//       setTimeout(() => setUpdatedPatientId(undefined), 2000);
//     }
//   }, []);

//   return {
//     patients,
//     loading,
//     error,
//     updatedPatientId,
//     lastUpdate,
//     handlePatientUpdate
//   };
// };
