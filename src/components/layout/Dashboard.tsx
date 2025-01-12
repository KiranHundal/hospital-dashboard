import { Header } from './Header';
import { PatientTable } from '../patient/PatientTable';
import { PatientSummary } from '../patient/PatientSummary';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Patient } from '../../types/patient';

interface DashboardProps {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  updatedPatientId?: string;
  lastUpdate?: string;
}

export const Dashboard = ({
  patients,
  loading,
  error,
  isConnected,
  updatedPatientId,
  lastUpdate
}: DashboardProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          patientCount={patients.length}
          isConnected={isConnected}
          lastUpdate={lastUpdate}
        />

        <PatientSummary patients={patients} />

        <PatientTable
          patients={patients}
          updatedPatientId={updatedPatientId}
        />
      </div>
    </div>
  );
};
