import { Patient } from '../../types/patient';

interface PatientRowProps {
  patient: Patient;
  isUpdated?: boolean;
}

export const PatientRow = ({ patient, isUpdated }: PatientRowProps) => (
  <tr className={`${isUpdated ? 'bg-blue-50 transition-colors duration-500' : ''}`}>
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
);
