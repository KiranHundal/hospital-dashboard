// src/App.tsx
import { useWebSocket } from './hooks/useWebSocket';
import { usePatients } from './hooks/usePatients';
import { Dashboard } from './components/layout/Dashboard';

function App() {
  const {
    patients,
    loading,
    error,
    updatedPatientId,
    lastUpdate,
    handlePatientUpdate
  } = usePatients();

  const { isConnected } = useWebSocket({
    onPatientUpdate: handlePatientUpdate
  });

  return (
    <Dashboard
      patients={patients}
      loading={loading}
      error={error}
      isConnected={isConnected}
      updatedPatientId={updatedPatientId}
      lastUpdate={lastUpdate}
    />
  );
}

export default App;
