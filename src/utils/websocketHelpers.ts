// import { QueryClient } from '@tanstack/react-query';
// import { Dispatch} from 'redux';
// import { Patient } from '../types/websocket';
// import { WebSocketMessage } from '../types/patient';
// import { updatePatient, clearUpdateHighlight } from '../store/slices/patientSlice';
// import { setError } from '../store/slices/websocketSlice';
// import { QUERY_KEYS } from '../hooks/queries';

// export const updatePatientData = (
//   queryClient: QueryClient,
//   patientId: string,
//   vitals: Record<string, unknown>,
//   isUpdated: boolean
// ) => {
//   // Update patients list
//   queryClient.setQueryData(QUERY_KEYS.patients, (oldData: Patient[] | undefined) => {
//     if (!Array.isArray(oldData)) return oldData;

//     const updatedPatients = oldData.map((patient) =>
//       patient.id === patientId
//         ? { ...patient, vitals: { ...patient.vitals, ...vitals }, isUpdated }
//         : patient
//     );

//     localStorage.setItem('patients', JSON.stringify(updatedPatients));
//     return updatedPatients;
//   });

//   // Update individual patient
//   queryClient.setQueryData(
//     QUERY_KEYS.patient(patientId),
//     (oldData: Patient | undefined) => {
//       if (!oldData) return oldData;

//       const updatedPatient = {
//         ...oldData,
//         vitals: { ...oldData.vitals, ...vitals },
//         isUpdated,
//       };

//       localStorage.setItem(`patient-${patientId}`, JSON.stringify(updatedPatient));
//       return updatedPatient;
//     }
//   );
// };

// export const processWebSocketMessage = (
//   message: WebSocketMessage,
//   queryClient: QueryClient,
//   dispatch: Dispatch
// ) => {
//   try {
//     dispatch(
//       updatePatient({
//         patientId: message.patientId,
//         vitals: message.vitals,
//         isUpdated: true,
//       })
//     );

//     updatePatientData(queryClient, message.patientId, message.vitals, true);

//     setTimeout(() => {
//       dispatch(clearUpdateHighlight());
//       updatePatientData(queryClient, message.patientId, message.vitals, false);
//     }, 2000);
//   } catch (err) {
//     console.error('Error processing WebSocket message:', err);
//     dispatch(setError('Error processing update'));
//   }
// };
