import React, { useEffect } from "react";
import { Patient } from "../../types/patient";
import { PatientTable } from "../patient/PatientTable";
import { withLoading } from "../../hocs/withLoading";

const PatientTableWithLoading = withLoading(PatientTable);

interface SortedPatientTableContentProps {
  sortedData: Patient[];
  sortConfig: any;
  handleSort: (field: keyof Patient) => void;
  resetSort: () => void;
  updatedPatientId?: string;
  isLoading: boolean;
  error: Error | null;
  onResetSortChange: (resetSort: () => void) => void;
}

const SortedPatientTableContent: React.FC<SortedPatientTableContentProps> = ({
  sortedData,
  sortConfig,
  handleSort,
  resetSort,
  updatedPatientId,
  isLoading,
  error,
  onResetSortChange,
}) => {
  useEffect(() => {
    onResetSortChange(resetSort);
  }, [onResetSortChange, resetSort]);

  return (
    <PatientTableWithLoading
      patients={sortedData}
      updatedPatientId={updatedPatientId}
      onSort={handleSort}
      sortConfig={sortConfig}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default SortedPatientTableContent;
