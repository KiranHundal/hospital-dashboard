import { useCallback, useState } from "react";
import { useSearch } from "./useSearch";
import { Patient } from "../types/patient";
import { usePatientFilter } from "./usePatientFilter";

export const useFilterManager = (patients: Patient[]) => {
  const { filteredPatients, setFilterCriteria, resetFilters } = usePatientFilter(patients);
  const {
    searchTerm,
    setSearchTerm,
    setExactSearchTerm,
    filteredPatients: searchedPatients
  } = useSearch(filteredPatients);

  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);
  const [currentResetSort, setCurrentResetSort] = useState<(() => void) | null>(null);

  const handleResetSortChange = useCallback((resetSort: () => void) => {
    setCurrentResetSort(() => resetSort);
  }, []);

  const resetAll = useCallback(() => {
    resetFilters();
    setSearchTerm("");
    setExactSearchTerm("");
    setFilterPanelOpen(false);
    currentResetSort?.();
  }, [resetFilters, setSearchTerm, setExactSearchTerm, currentResetSort]);

  return {
    isFilterPanelOpen,
    setFilterPanelOpen,
    searchTerm,
    setSearchTerm,
    setExactSearchTerm,
    searchedPatients,
    setFilterCriteria,
    resetAll,
    handleResetSortChange
  };
};
