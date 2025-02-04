import { Header } from "../../Header/Header";
import { PatientSummary } from "../../patient/PatientSummary";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { PatientFilterPanel } from "../../patient/PatientFilterPanel";
import { SearchAndFilterBar } from "../../ui/SearchAndFilterBar";
import { usePatients } from "../../../hooks/queries";
import { withLoading } from "../../../hocs/withLoading";
import { useTheme } from "../../../hooks/useTheme";
import { PatientGrid } from "./PatientGrid";
import { PatientList } from "./PatientList";
import { usePagination } from "../../../hooks/usePagination";
import SplitScreenDashboard from "./SplitScreenDashboard";
import { useLayoutManager } from "../../../hooks/useLayoutManager";
import { useWebSocketManager } from "../../../hooks/useWebSocketManager";
import { useFilterManager } from "../../../hooks/useFilterManager";

const PatientSummaryWithLoading = withLoading(PatientSummary);

export const Dashboard: React.FC = () => {
  const {
    data: patients = [],
    isLoading,
    error,
    isError,
    dataUpdatedAt,
    refetch,
  } = usePatients();

  const { isConnected, updatedPatientId } = useWebSocketManager(patients);

  const { colors } = useTheme();

  const { layout, setLayout, isSplitScreen, toggleSplitScreen } =
    useLayoutManager();
  const {
    isFilterPanelOpen,
    setFilterPanelOpen,
    searchTerm,
    setSearchTerm,
    setExactSearchTerm,
    searchedPatients,
    setFilterCriteria,
    resetAll,
    handleResetSortChange,
  } = useFilterManager(patients);

  const {
    paginatedData: paginatedPatients,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    // resetPagination,
  } = usePagination(searchedPatients, 10);

  const paginationProps = {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  };

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
              toggleSplitScreen={toggleSplitScreen}
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
