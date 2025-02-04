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
import SplitScreenDashboard from "./SplitScreenDashboard";
import { Patient } from "../../types/patient";
import { PaginationControls } from "../ui/PaginationControls";
import { usePagination } from "../../hooks/usePagination";

const PatientSummaryWithLoading = withLoading(PatientSummary);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

interface PatientGridProps {
  patients: Patient[];
  updatedPatientId?: string;
  pagination: PaginationProps;
}

interface PatientListProps extends PatientGridProps {
  isLoading: boolean;
  error: Error | null;
  onResetSortChange: (resetSort: () => void) => void;
}

const PatientGrid: React.FC<PatientGridProps> = ({
  patients,
  updatedPatientId,
  pagination,
}) => {
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <ExpandablePatientCard
            key={patient.id}
            patient={patient}
            isUpdated={patient.id === updatedPatientId}
          />
        ))}
      </div>
      <PaginationControls {...pagination} />
    </>
  );
};

const PatientList: React.FC<PatientListProps> = ({
  patients,
  updatedPatientId,
  isLoading,
  error,
  onResetSortChange,
  pagination,
}) => {
  return (
    <>
      <SortedPatientTable
        patients={patients}
        updatedPatientId={updatedPatientId}
        isLoading={isLoading}
        error={error}
        onResetSortChange={onResetSortChange}
      />
      <PaginationControls {...pagination} />
    </>
  );
};

export const Dashboard: React.FC = () => {
  const {
    data: patients = [],
    isLoading,
    error,
    isError,
    dataUpdatedAt,
    refetch,
  } = usePatients();

  const roomTopics = useMemo(() => {
    const uniqueRooms = [...new Set(patients.map((patient) => patient.room))];
    return uniqueRooms.map((room) => `room-${room}` as SubscriptionTopic);
  }, [patients]);

  useWebSocket(["vitals", "admissions", "discharges", ...roomTopics]);

  const { isConnected } = useAppSelector(selectWebSocketState);
  const updatedPatientId = useAppSelector(selectUpdatedPatientId);
  const { colors } = useTheme();

  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [isSplitScreen, setIsSplitScreen] = useState(false);
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

  const {
    paginatedData: paginatedPatients,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  } = usePagination(searchedPatients, 10);

  const paginationProps = {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  };

  const handleResetSortChange = useCallback((resetSort: () => void) => {
    setCurrentResetSort(() => resetSort);
  }, []);

  const resetAll = useCallback(() => {
    setFilterCriteria({});
    setSearchTerm("");
    setExactSearchTerm("");
    setFilterPanelOpen(false);
    resetPagination();
    if (currentResetSort) {
      currentResetSort();
    }
  }, [setFilterCriteria, setSearchTerm, setExactSearchTerm, currentResetSort, resetPagination]);

  if (isLoading) return <LoadingSpinner />;
  if (isError && error) return <ErrorMessage message={error.message} />;

  const renderContent = () => {
    if (isSplitScreen) {
      return <SplitScreenDashboard patients={searchedPatients} />;
    }
    return layout === "grid" ? (
      <PatientGrid
        patients={paginatedPatients}
        updatedPatientId={updatedPatientId}
        pagination={paginationProps}
      />
    ) : (
      <PatientList
        patients={paginatedPatients}
        updatedPatientId={updatedPatientId}
        isLoading={isLoading}
        error={error}
        onResetSortChange={handleResetSortChange}
        pagination={paginationProps}
      />
    );
  };

  return (
    <div className={`min-h-screen ${colors.background}`}>
      <div
        className={`sticky top-0 z-40 ${colors.cardBg} shadow-sm backdrop-blur`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Header
              patientCount={searchedPatients.length}
              isConnected={isConnected}
              lastUpdate={
                dataUpdatedAt
                  ? new Date(dataUpdatedAt).toISOString()
                  : undefined
              }
              layout={layout}
              setLayout={setLayout}
              isSplitScreen={isSplitScreen}
              toggleSplitScreen={() => setIsSplitScreen((prev) => !prev)}
              refreshData={refetch}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PatientSummaryWithLoading
          patients={searchedPatients}
          onFilterChange={setFilterCriteria}
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

          <div className="mt-6">{renderContent()}</div>
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
