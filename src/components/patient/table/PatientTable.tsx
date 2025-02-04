import React from "react";
import { Patient } from "../../../types/patient";
import { PatientRow } from "./PatientRow";
import { useTheme } from "../../../hooks/useTheme";
import { SortedTableHeader, Column } from "./SortedTableHeader";
import { SortConfig } from "../../../types/sorting";

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
    <div className="overflow-hidden rounded-lg transition-colors duration-300">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <SortedTableHeader
          columns={columns}
          sortConfig={sortConfig}
          onSort={onSort}
        />
        <tbody
          className={`${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          } transition-colors duration-300`}
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
