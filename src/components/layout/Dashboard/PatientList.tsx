import React from "react";
import { PaginationControls } from "../../ui/PaginationControls";
import SortedPatientTable from "../../patient/SortedPatientTable";
import { PatientListProps } from "../../../types/dashboard";

export const PatientList: React.FC<PatientListProps> = ({
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
