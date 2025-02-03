import { useState, useCallback, useMemo } from "react";
import { useAppSelector } from "../../hooks/redux";
import {
  selectUpdatedPatientId,
  selectWebSocketState,
} from "../../store/selectors/patientSelectors";
import { Header } from "./Header";
import { PatientSummary } from "../patient/PatientSummary";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorMessage } from "../ui/ErrorMessage";
import { usePatientFilter } from "../../hooks/usePatientFilter";
import { useSearch } from "../../hooks/useSearch";
import { PatientFilterPanel } from "../patient/PatientFilterPanel";
import { SearchAndFilterBar } from "../ui/SearchAndFilterBar";
import { usePatients } from "../../hooks/queries";
import { withLoading } from "../../hocs/withLoading";
import { useWebSocket } from "../../hooks/useWebSocket";
import { SubscriptionTopic } from "../../types/websocket";
import SortedPatientTable from "../patient/SortedPatientTable";
import ExpandablePatientCard from "../patient/ExpandablePatientCard";
import { useTheme } from "../../hooks/useTheme";
import { MoonIcon, SunIcon, GridIcon, ListIcon, Split } from 'lucide-react';
import SplitScreenDashboard from "./SplitScreenDashboard";
import { Patient } from "../../types/patient";

const PatientSummaryWithLoading = withLoading(PatientSummary);

interface PatientGridProps {
  patients: Patient[];
  updatedPatientId?: string;
}

interface PatientListProps extends PatientGridProps {
  isLoading: boolean;
  error: Error | null;
  onResetSortChange: (resetSort: () => void) => void;
}

const PatientGrid: React.FC<PatientGridProps> = ({ patients, updatedPatientId }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patient) => (
        <ExpandablePatientCard
          key={patient.id}
          patient={patient}
          isUpdated={patient.id === updatedPatientId}
        />
      ))}
    </div>
  );
};

const PatientList: React.FC<PatientListProps> = ({
  patients,
  updatedPatientId,
  isLoading,
  error,
  onResetSortChange
}) => {
  return (
    <SortedPatientTable
      patients={patients}
      updatedPatientId={updatedPatientId}
      isLoading={isLoading}
      error={error}
      onResetSortChange={onResetSortChange}
    />
  );
};

export const Dashboard: React.FC = () => {
  const {
    data: patients = [],
    isLoading,
    error,
    isError,
    dataUpdatedAt,
  } = usePatients();

  const roomTopics = useMemo(() => {
    const uniqueRooms = [...new Set(patients.map((patient) => patient.room))];
    return uniqueRooms.map((room) => `room-${room}` as SubscriptionTopic);
  }, [patients]);

  useWebSocket(["vitals", "admissions", "discharges", ...roomTopics]);

  const { isConnected } = useAppSelector(selectWebSocketState);
  const updatedPatientId = useAppSelector(selectUpdatedPatientId);
  const { theme, toggleTheme, colors } = useTheme();
  const [layout, setLayout] = useState<'grid' | 'list' | 'split'>('grid');
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);
  const [currentResetSort, setCurrentResetSort] = useState<(() => void) | null>(null);

  const { filteredPatients, setFilterCriteria } = usePatientFilter(patients);
  const {
    searchTerm,
    setSearchTerm,
    setExactSearchTerm,
    filteredPatients: searchedPatients,
  } = useSearch(filteredPatients);

  const handleResetSortChange = useCallback((resetSort: () => void) => {
    setCurrentResetSort(() => resetSort);
  }, []);

  const resetAll = useCallback(() => {
    setFilterCriteria({});
    setSearchTerm("");
    setExactSearchTerm("");
    setFilterPanelOpen(false);
    if (currentResetSort) {
      currentResetSort();
    }
  }, [setFilterCriteria, setSearchTerm, setExactSearchTerm, currentResetSort]);

  if (isLoading) return <LoadingSpinner />;
  if (isError && error) return <ErrorMessage message={error.message} />;

  const renderContent = () => {
    switch (layout) {
      case 'grid':
        return (
          <PatientGrid
            patients={searchedPatients}
            updatedPatientId={updatedPatientId}
          />
        );
      case 'list':
        return (
          <PatientList
            patients={searchedPatients}
            updatedPatientId={updatedPatientId}
            isLoading={isLoading}
            error={error}
            onResetSortChange={handleResetSortChange}
          />
        );
      case 'split':
        return (
          <SplitScreenDashboard patients={searchedPatients} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${colors.background}`}>
      <div className={`sticky top-0 z-40 ${colors.cardBg} shadow-sm backdrop-blur`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Header
              patientCount={searchedPatients.length}
              isConnected={isConnected}
              lastUpdate={dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : undefined}
            />

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLayout(prev => {
                  if (prev === 'grid') return 'list';
                  if (prev === 'list') return 'split';
                  return 'grid';
                })}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title={`Switch to ${
                  layout === 'grid' ? 'list' :
                  layout === 'list' ? 'split' : 'grid'
                } view`}
              >
                {layout === 'grid' ? <ListIcon size={20} /> :
                 layout === 'list' ? <Split size={20} /> : <GridIcon size={20} />}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PatientSummaryWithLoading
          patients={searchedPatients}
          isLoading={isLoading}
          error={error}
        />

        <div className="mt-6">
          <SearchAndFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={() => setExactSearchTerm(searchTerm.trim())}
            onReset={resetAll}
            onFilter={() => setFilterPanelOpen(true)}
          />

          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {isFilterPanelOpen && (
        <PatientFilterPanel
          onClose={() => setFilterPanelOpen(false)}
          onFilterChange={setFilterCriteria}
        />
      )}
    </div>
  );
};
