import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Patient } from "../../../types/patient";
import { SortConfig } from "../../../types/sorting";

export interface Column {
  field: keyof Patient | "vitals";
  label: string;
  sortable?: boolean;
}

interface SortedTableHeaderProps {
  columns: Column[];
  sortConfig: SortConfig<Patient> | null;
  onSort: (field: keyof Patient | "vitals") => void;
}

export const SortedTableHeader: React.FC<SortedTableHeaderProps> = ({
  columns,
  sortConfig,
  onSort,
}) => {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.label}
            onClick={() => {
              if (column.sortable) onSort(column.field);
            }}
            style={{ cursor: column.sortable ? "pointer" : "default" }}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <div className="flex items-center">
              {column.label}
              {column.sortable &&
                sortConfig?.field === column.field &&
                (sortConfig.direction === "asc" ? (
                  <ChevronUp size={16} className="ml-1" />
                ) : (
                  <ChevronDown size={16} className="ml-1" />
                ))}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};
