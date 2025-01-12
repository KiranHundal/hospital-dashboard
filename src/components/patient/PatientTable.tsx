import { Patient } from '../../types/patient';
import { PatientRow } from './PatientRow';

interface PatientTableProps {
  patients: Patient[];
  updatedPatientId?: string;
}

export const PatientTable = ({ patients, updatedPatientId }: PatientTableProps) => (
  <div className="bg-white shadow overflow-hidden rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Patient ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Room
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Age
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Gender
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Vitals
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
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
