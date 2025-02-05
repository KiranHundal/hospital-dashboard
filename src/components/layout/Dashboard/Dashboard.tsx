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
import { styles } from "../../../styles";
import clsx from "clsx";
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
    <div className={clsx(styles.dashboard.container.base, colors.background)}>
      <div
        className={clsx(
          styles.dashboard.container.header.wrapper,
          colors.cardBg
        )}
      >
        <div className={styles.dashboard.container.header.container}>
          <div className={styles.dashboard.container.header.content}>
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

      <div className={styles.dashboard.container.main.container}>
        <PatientSummaryWithLoading
          patients={searchedPatients}
          onFilterChange={setFilterCriteria}
          isLoading={isLoading}
          error={error}
        />

        <div className={styles.dashboard.container.main.section}>
          <SearchAndFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={() => setExactSearchTerm(searchTerm.trim())}
            onReset={resetAll}
            onFilter={() => setFilterPanelOpen(true)}
          />

          <div className={styles.dashboard.container.main.section}>
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
