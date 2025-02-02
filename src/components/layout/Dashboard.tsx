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

  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);
  const [currentResetSort, setCurrentResetSort] = useState<(() => void) | null>(
    null
  );

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
    <div className="min-h-screen bg-gray-50">
      {isFilterPanelOpen && (
        <PatientFilterPanel
          onClose={() => setFilterPanelOpen(false)}
          onFilterChange={setFilterCriteria}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          patientCount={searchedPatients.length}
          isConnected={isConnected}
          lastUpdate={
            dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : undefined
          }
        />

        <PatientSummaryWithLoading
          patients={searchedPatients}
          isLoading={isLoading}
          error={error}
        />

        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={() => setExactSearchTerm(searchTerm.trim())}
          onReset={resetAll}
          onFilter={() => setFilterPanelOpen(true)}
        />

        <SortedPatientTable
          patients={searchedPatients}
          updatedPatientId={updatedPatientId}
          isLoading={isLoading}
          error={error}
          onResetSortChange={handleResetSortChange}
        />
      </div>
    </div>
  );
};
