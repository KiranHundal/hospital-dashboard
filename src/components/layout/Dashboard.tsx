import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { selectPatientsDashboard } from "../../store/selectors/patientSelectors";
import { Header } from "./Header";
import { PatientTable } from "../patient/PatientTable";
import { PatientSummary } from "../patient/PatientSummary";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorMessage } from "../ui/ErrorMessage";
import { usePatientFilter } from "../../hooks/usePatientFilter";
import { useSearch } from "../../hooks/useSearch";
import { PatientFilterPanel } from "../patient/PatientFilterPanel";
import { SearchAndFilterBar } from "../ui/SearchAndFilterBar";
import { useSorting } from "../../hooks/useSorting";

export const Dashboard = () => {
  const {
    patients,
    loading,
    error,
    updatedPatientId,
    lastUpdate,
    isConnected,
  } = useAppSelector(selectPatientsDashboard);

  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

  const { filteredPatients, setFilterCriteria } = usePatientFilter(patients);
  const {
    searchTerm,
    setSearchTerm,
    setExactSearchTerm,
    filteredPatients: searchedPatients,
  } = useSearch(filteredPatients);
  const { sortedData: sortedPatients, sortConfig, handleSort, resetSorting } = useSorting(
    searchedPatients,
    "id"
  );

  const resetAll = () => {
    setFilterCriteria({});
    setSearchTerm("");
    setExactSearchTerm("");
    setFilterPanelOpen(false);
    resetSorting();
  };

  useEffect(() => {
    console.log("Sorted patients after reset:", sortedPatients);
  }, [sortedPatients]);

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
        <Header
          patientCount={sortedPatients.length}
          isConnected={isConnected}
          lastUpdate={lastUpdate}
        />

        <PatientSummary patients={sortedPatients} />

        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={() => setExactSearchTerm(searchTerm.trim())}
          onReset={resetAll}
          onFilter={() => setFilterPanelOpen(true)}
          onResetSorting={resetSorting}
        />

        <PatientTable
          patients={sortedPatients}
          updatedPatientId={updatedPatientId}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>
    </div>
  );
};
