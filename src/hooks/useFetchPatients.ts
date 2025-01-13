// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { CONFIG } from '../config/constants';

// export const useFetchPatients = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const response = await fetch(`${CONFIG.API_URL}`);
//         if (!response.ok) throw new Error('Failed to fetch patients');

//         const data = await response.json();
//         dispatch(setPatients(data));
//       } catch (err) {
//         console.error('Error fetching patients:', err);
//       }
//     };

//     fetchPatients();
//   }, [dispatch]);
// };
