import React from "react";
import { SortableData } from "../../ui/SortableData";
import SortedPatientTableContent from "./SortedPatientTableContent";
import { Patient } from "../../../types/patient";

interface SortedPatientTableProps {
  patients: Patient[];
  updatedPatientId?: string;
  isLoading: boolean;
  error: Error | null;
  onResetSortChange: (resetSort: () => void) => void;
}

const SortedPatientTable: React.FC<SortedPatientTableProps> = ({
  patients,
  updatedPatientId,
  isLoading,
  error,
  onResetSortChange,
}) => {
  return (
    <SortableData
      data={patients}
      defaultSortField="id"
      defaultSortDirection="asc"
    >
      {({ sortedData, sortConfig, handleSort, resetSort }) => (
        <SortedPatientTableContent
          sortedData={sortedData}
          sortConfig={sortConfig}
          handleSort={handleSort}
          resetSort={resetSort}
          updatedPatientId={updatedPatientId}
          isLoading={isLoading}
          error={error}
          onResetSortChange={onResetSortChange}
        />
      )}
    </SortableData>
  );
};

export default SortedPatientTable;
