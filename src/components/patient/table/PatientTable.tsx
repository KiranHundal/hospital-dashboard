import React from "react";
import { Patient } from "../../../types/patient";
import { PatientRow } from "./PatientRow";
import { useTheme } from "../../../hooks/useTheme";
import { SortedTableHeader, Column } from "./SortedTableHeader";
import { SortConfig } from "../../../types/sorting";
import { styles } from "../../../styles";
import clsx from "clsx";

interface PatientTableProps {
  patients: Patient[];
  updatedPatientId?: string;
  sortConfig: SortConfig<Patient> | null;
  onSort: (field: keyof Patient | "vitals") => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  updatedPatientId,
  sortConfig,
  onSort,
}) => {
  const { theme } = useTheme();

  const columns: Column[] = [
    { field: "id", label: "ID", sortable: true },
    { field: "name", label: "Name", sortable: true },
    { field: "room", label: "Room", sortable: true },
    { field: "age", label: "Age/Gender", sortable: true },
    { field: "vitals", label: "BP", sortable: true },
    { field: "vitals", label: "O₂", sortable: true },
    { field: "vitals", label: "HR", sortable: true },
    { field: "vitals", label: "Last Update", sortable: true },
    { field: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className={styles.table.content.wrapper}>
      <table
        className={clsx(styles.table.table.base, styles.table.table.divider)}
      >
        <SortedTableHeader
          columns={columns}
          sortConfig={sortConfig}
          onSort={onSort}
        />
        <tbody
          className={clsx(
            "transition-colors duration-300",
            theme === "dark"
              ? styles.table.content.background.dark
              : styles.table.content.background.light
          )}
        >
          {patients.map((patient) => (
            <PatientRow
              key={patient.id}
              patient={patient}
              isUpdated={patient.id === updatedPatientId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
