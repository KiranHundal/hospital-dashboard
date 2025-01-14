import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Patient } from "../../types/patient";
import { PatientRow } from "./PatientRow";
import { usePagination } from "../../hooks/usePagination";

interface PatientTableProps {
  patients: Patient[];
  updatedPatientId?: string;
  rowsPerPage?: number;
  onSort: (field: keyof Patient) => void;
  sortConfig: { field: keyof Patient; direction: "asc" | "desc" } | null;
}

export const PatientTable = ({
  patients,
  updatedPatientId,
  rowsPerPage = 10,
  onSort,
  sortConfig,
}: PatientTableProps) => {
  const {
    paginatedData: paginatedPatients,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(patients, rowsPerPage);

  const SortIndicator = ({ field }: { field: keyof Patient }) => {
    if (sortConfig?.field !== field) return null;

    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block ml-1" />
    );
  };

  const TableHeader = ({ field, children }: { field: keyof Patient; children: React.ReactNode }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {children}
        <SortIndicator field={field} />
      </div>
    </th>
  );

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader field="id">Patient ID</TableHeader>
            <TableHeader field="name">Name</TableHeader>
            <TableHeader field="room">Room</TableHeader>
            <TableHeader field="age">Age</TableHeader>
            <TableHeader field="gender">Gender</TableHeader>
            <TableHeader field="vitals">Vitals</TableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedPatients.map((patient) => (
            <PatientRow
              key={patient.id}
              patient={patient}
              isUpdated={patient.id === updatedPatientId}
            />
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center p-4 bg-gray-50">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
