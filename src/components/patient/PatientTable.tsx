// PatientTable.tsx
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Patient } from "../../types/patient";
import { PatientRow } from "./PatientRow";
import { useTheme } from "../../hooks/useTheme";
import { SortConfig } from "../shared/SortableData";

interface PatientTableProps {
  patients: Patient[];
  updatedPatientId?: string;
  sortConfig: SortConfig<Patient> | null;
  onSort: (field: keyof Patient) => void;
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

  return (
    <div
      className={`overflow-hidden rounded-lg transition-colors duration-300`}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead
          className={`${theme === "dark" ? "bg-slate-800/50" : "bg-gray-50"}
                       transition-colors duration-300`}
        >
          <tr>
            {[
              { key: "id", label: "ID" },
              { key: "name", label: "Name" },
              { key: "room", label: "Room" },
              { key: "age", label: "Age/Gender" },
              { key: "vitals", label: "BP", sortable: true },
              { key: "vitals", label: "O₂", sortable: true },
              { key: "vitals", label: "HR", sortable: true },
              { key: "vitals", label: "Last Update", sortable: true },
              { key: "", label: "Actions", sortable: false },
            ].map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`
                  px-6 py-3 text-left text-xs font-medium tracking-wider
                  ${theme === "dark" ? "text-gray-400" : "text-gray-500"}
                  ${column.sortable ? "cursor-pointer" : ""}
                  transition-colors duration-300
                `}
                onClick={() =>
                  column.sortable && onSort(column.key as keyof Patient)
                }
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable &&
                    sortConfig?.field === column.key &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
 <tbody className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}
                        transition-colors duration-300`}>          {patients.map((patient) => (
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
