import { useState } from "react";
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

  const resetAll = () => {
    setFilterCriteria({});
    setSearchTerm("");
    setExactSearchTerm("");
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
        <Header
          patientCount={searchedPatients.length}
          isConnected={isConnected}
          lastUpdate={lastUpdate}
        />

        <PatientSummary patients={searchedPatients} />

        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={() => setExactSearchTerm(searchTerm.trim())}
          onReset={resetAll}
          onFilter={() => setFilterPanelOpen(true)}
        />

        {/* <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="w-full border rounded px-4 py-2 pr-12"
              />
              <div
                onClick={() => setExactSearchTerm(searchTerm.trim())}
                className="absolute right-0 top-0 h-full px-3 border-l flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <FiSearch className="w-5 h-5" />
              </div>
            </div>

          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetAll}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FiRefreshCcw className="w-5 h-5" />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={() => setFilterPanelOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FiFilter className="w-5 h-5" />
              <span>Advanced Filter</span>
            </button>
          </div>
        </div> */}

        <PatientTable
          patients={searchedPatients}
          updatedPatientId={updatedPatientId}
        />
      </div>
    </div>
  );
};
