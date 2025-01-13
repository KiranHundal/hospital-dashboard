import { useEffect } from 'react';
import { useAppDispatch } from './hooks/redux';
import { useWebSocket } from './hooks/useWebSocket';
import { Dashboard } from './components/layout/Dashboard';
import { PatientService } from './services/patientService';
import { setLoading, setPatients, setError } from './store/slices/patientSlice';

function App() {
  const dispatch = useAppDispatch();

  useWebSocket();

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading(true));
      try {
        const patientService = PatientService.getInstance();
        const { patients, error: serviceError } = await patientService.fetchPatients();

        if (serviceError) {
          dispatch(setError(serviceError));
        } else {
          dispatch(setPatients(patients));
          patientService.persistPatientsToCache(patients);
        }
      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : 'Failed to load patient data';
        dispatch(setError(errorMessage));
      }
    };

    loadData();
  }, [dispatch]);

  return <Dashboard />;
}

export default App;
