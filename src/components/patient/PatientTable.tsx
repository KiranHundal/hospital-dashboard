import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Patient } from '../../types/patient';

type SortField = 'id' | 'name' | 'room' | 'age' | 'gender' | 'vitals';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface PatientTableProps {
  patients: Patient[];
  updatedPatientId?: string;
}

export const PatientTable = ({ patients, updatedPatientId }: PatientTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (field: SortField) => {
    setSortConfig(current => {
      if (current?.field === field) {
        return {
          field,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { field, direction: 'asc' };
    });
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortConfig?.field !== field) return null;

    return sortConfig.direction === 'asc' ?
      <ChevronUp className="w-4 h-4 inline-block ml-1" /> :
      <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  };

  const sortedPatients = useMemo(() => {
    if (!sortConfig) return patients;

    return [...patients].sort((a, b) => {
      const { field, direction } = sortConfig;
      const multiplier = direction === 'asc' ? 1 : -1;

      switch (field) {
        case 'id':
        case 'name':
        case 'room':
        case 'gender':
          return multiplier * a[field].localeCompare(b[field]);

        case 'age':
          return multiplier * (a.age - b.age);

        case 'vitals':
          { const [aSystolic] = a.vitals.bloodPressure.split('/').map(Number);
          const [bSystolic] = b.vitals.bloodPressure.split('/').map(Number);
          return multiplier * (aSystolic - bSystolic); }

        default:
          return 0;
      }
    });
  }, [patients, sortConfig]);

  const TableHeader = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
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
          {sortedPatients.map((patient) => (
            <tr
              key={patient.id}
              className={`${patient.id === updatedPatientId ? 'bg-blue-50 transition-colors duration-500' : ''}`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {patient.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.room}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.age}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.gender}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>BP: {patient.vitals.bloodPressure}</div>
                <div>HR: {patient.vitals.heartRate} bpm</div>
                <div>O₂: {patient.vitals.oxygenLevel}%</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
