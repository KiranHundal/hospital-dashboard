import React, { useEffect } from "react";
import { Patient } from "../../../types/patient";
import PatientTable from "./PatientTable";
import { withLoading } from "../../../hocs/withLoading";
import { useTheme } from "../../../hooks/useTheme";
import { SortConfig } from "../../../types/sorting";
import { styles } from "../../../styles";
import clsx from "clsx";

const PatientTableWithLoading = withLoading(PatientTable);

interface SortedPatientTableContentProps {
  sortedData: Patient[];
  sortConfig: SortConfig<Patient> | null;
  handleSort: (field: keyof Patient | "vitals") => void;
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
  const { theme } = useTheme();

  useEffect(() => {
    onResetSortChange(resetSort);
  }, [onResetSortChange, resetSort]);

  return (
    <div
      className={clsx(
        styles.table.content.wrapper,
        theme === "dark"
          ? styles.table.content.background.dark
          : styles.table.content.background.light
      )}
    >
      <PatientTableWithLoading
        patients={sortedData}
        updatedPatientId={updatedPatientId}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default SortedPatientTableContent;
