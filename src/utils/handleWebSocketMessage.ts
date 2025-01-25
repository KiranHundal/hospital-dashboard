// import { QueryClient } from '@tanstack/react-query';
// import { Dispatch } from 'redux';
// import { WebSocketMessage } from '../types/patient';
// import { updatePatient, clearUpdateHighlight } from '../store/slices/patientSlice';
// import { setError } from '../store/slices/websocketSlice';
// import { QUERY_KEYS } from '../hooks/queries';

// export const handleWebSocketMessage = (
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

//     queryClient.setQueryData(QUERY_KEYS.patients, (oldData: any) => {
//       if (!Array.isArray(oldData)) return oldData;

//       const updatedPatients = oldData.map((patient) =>
//         patient.id === message.patientId
//           ? { ...patient, vitals: { ...patient.vitals, ...message.vitals }, isUpdated: true }
//           : patient
//       );

//       localStorage.setItem('patients', JSON.stringify(updatedPatients));
//       return updatedPatients;
//     });

//     // Update individual patient in the cache
//     queryClient.setQueryData(
//       QUERY_KEYS.patient(message.patientId),
//       (oldData: any) => {
//         if (!oldData) return oldData;

//         const updatedPatient = {
//           ...oldData,
//           vitals: { ...oldData.vitals, ...message.vitals },
//           isUpdated: true,
//         };

//         localStorage.setItem(`patient-${message.patientId}`, JSON.stringify(updatedPatient));
//         return updatedPatient;
//       }
//     );

//     setTimeout(() => {
//       dispatch(clearUpdateHighlight());

//       queryClient.setQueryData(QUERY_KEYS.patients, (oldData: any) => {
//         if (!Array.isArray(oldData)) return oldData;

//         const clearedPatients = oldData.map((patient) =>
//           patient.id === message.patientId
//             ? { ...patient, isUpdated: false }
//             : patient
//         );

//         localStorage.setItem('patients', JSON.stringify(clearedPatients));
//         return clearedPatients;
//       });
//     }, 2000);
//   } catch (err) {
//     console.error('Error processing WebSocket message:', err);
//     dispatch(setError('Error processing update'));
//   }
// };
