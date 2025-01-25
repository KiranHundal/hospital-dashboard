import { Patient } from "../../types/patient";
import { useVitalSigns } from "../../hooks/useVitalSigns";

interface PatientRowProps {
  patient: Patient;
  isUpdated?: boolean;
}

export const PatientRow = ({ patient, isUpdated }: PatientRowProps) => {
  const vitalStatus = useVitalSigns(patient.vitals);
  const isCritical = vitalStatus.severityScore > 0;

  return (
    <tr
      className={`
        ${isUpdated ? "bg-blue-50" : ""}
        ${isCritical ? "relative bg-red-50" : ""}
        transition-colors duration-500
      `}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center">
          {patient.id}
          {isCritical && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Critical
            </span>
          )}
        </div>
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
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div
          className={`${
            vitalStatus.isBPHigh || vitalStatus.isBPLow
              ? "text-red-600 font-medium"
              : "text-gray-500"
          }`}
        >
          BP: {patient.vitals.bloodPressure}
        </div>
        <div
          className={`${
            vitalStatus.isHRHigh || vitalStatus.isHRLow
              ? "text-red-600 font-medium"
              : "text-gray-500"
          }`}
        >
          HR: {patient.vitals.heartRate} bpm
        </div>
        <div
          className={`${
            vitalStatus.isO2Low ? "text-red-600 font-medium" : "text-gray-500"
          }`}
        >
          O₂: {patient.vitals.oxygenLevel}%
        </div>
      </td>
    </tr>
  );
};
