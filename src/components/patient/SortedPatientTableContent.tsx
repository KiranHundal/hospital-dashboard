import React, { useEffect } from "react";
import { Patient } from "../../types/patient";
import { PatientTable } from "./PatientTable";
import { withLoading } from "../../hocs/withLoading";
import { SortConfig } from '../shared/SortableData';
import { useTheme } from "../../hooks/useTheme";

const PatientTableWithLoading = withLoading(PatientTable);

interface SortedPatientTableContentProps {
  sortedData: Patient[];
  sortConfig: SortConfig<Patient> | null;
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
    const { theme } = useTheme();

  useEffect(() => {
    onResetSortChange(resetSort);
  }, [onResetSortChange, resetSort]);

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}
                   transition-colors duration-300 rounded-lg`}>
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
