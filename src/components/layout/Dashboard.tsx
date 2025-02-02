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
import { useTheme } from "../../hooks/useTheme";
import { MoonIcon, SunIcon, GridIcon, ListIcon, Split } from 'lucide-react';
import SplitScreenDashboard from "./SplitScreenDashboard";

const PatientSummaryWithLoading = withLoading(PatientSummary);

export const Dashboard = () => {
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
  const { theme, toggleTheme } = useTheme();
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
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

          {layout === 'split' ? (
            <SplitScreenDashboard patients={searchedPatients} />
          ) : (
            <div className={layout === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6' : 'mt-6'}>
              <SortedPatientTable
                patients={searchedPatients}
                updatedPatientId={updatedPatientId}
                isLoading={isLoading}
                error={error}
                onResetSortChange={handleResetSortChange}
              />
            </div>
          )}
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
