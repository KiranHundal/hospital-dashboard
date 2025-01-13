import { useState } from 'react';
import { Header } from './Header';
import { PatientTable } from '../patient/PatientTable';
import { PatientSummary } from '../patient/PatientSummary';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Patient } from '../../types/patient';
import { usePatientFilter } from '../../hooks/usePatientFilter';
import { useSearch } from '../../hooks/useSearch';
import { PatientFilterPanel } from '../patient/PatientFilterPanel';

export const Dashboard = ({
  patients,
  loading,
  error,
  isConnected,
  updatedPatientId,
  lastUpdate,
}: {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  updatedPatientId?: string;
  lastUpdate?: string;
}) => {
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

  const { filteredPatients, setFilterCriteria } = usePatientFilter(patients);

  const { searchTerm, setSearchTerm, setExactSearchTerm, filteredPatients: searchedPatients } =
    useSearch(filteredPatients);

  const resetAll = () => {
    setFilterCriteria({});
    setSearchTerm('');
    setExactSearchTerm('');
    setFilterPanelOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {isFilterPanelOpen && (
        <PatientFilterPanel
          onClose={() => setFilterPanelOpen(false)}
          onFilterChange={setFilterCriteria}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header patientCount={searchedPatients.length} isConnected={isConnected} lastUpdate={lastUpdate} />

        <PatientSummary patients={searchedPatients} />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="w-64 border rounded px-4 py-2"
            />
            <button
              onClick={() => setExactSearchTerm(searchTerm.trim())}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Search
            </button>
            <button onClick={resetAll} className="p-2 text-gray-500 hover:text-gray-700">
              Reset
            </button>
          </div>
          <button onClick={() => setFilterPanelOpen(true)} className="p-2 text-gray-500 hover:text-gray-700">
            Filter
          </button>
        </div>

        <PatientTable patients={searchedPatients} updatedPatientId={updatedPatientId} />
      </div>
    </div>
  );
};
