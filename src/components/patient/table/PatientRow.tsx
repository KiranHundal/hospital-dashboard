import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Shield,
  Ban,
} from "lucide-react";
import { Patient } from "../../../types/patient";
import useVitalSigns from "../../../hooks/useVitalSigns";
import useTheme from "../../../hooks/useTheme";

interface PatientRowProps {
  patient: Patient;
  isUpdated?: boolean;
}

export const PatientRow: React.FC<PatientRowProps> = ({
  patient,
  isUpdated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const vitalStatus = useVitalSigns(patient.vitals);
  const isCritical = vitalStatus.severityScore > 0;
  const { theme, colors } = useTheme();

  const medicalHistory: string[] = Array.isArray(patient.medicalHistory)
    ? patient.medicalHistory
    : [];

  const formatTimestamp = (timestamp: number | undefined) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "" : date.toLocaleTimeString();
  };

  const getBackgroundColor = () => {
    if (isUpdated) return theme === "dark" ? "bg-blue-900/20" : "bg-blue-50";
    if (isCritical) return theme === "dark" ? "bg-red-900/20" : "bg-red-50";
    return theme === "dark" ? "bg-slate-900" : "bg-white";
  };

  return (
    <>
      <tr
        className={`
          ${getBackgroundColor()}
          transition-colors duration-500
          ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50"}

        `}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <div className="flex items-center space-x-2">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              {patient.id}
            </span>
            {isCritical && (
              <span className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
                Critical
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span className={colors.text.primary}>{patient.name}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span className={colors.text.primary}>{patient.room}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <div className={colors.text.primary}>{patient.age}</div>
          <div className={colors.text.secondary}>{patient.gender}</div>
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            vitalStatus.isBPHigh || vitalStatus.isBPLow
              ? colors.critical.text
              : colors.text.primary
          }`}
        >
          BP: {patient.vitals.bloodPressure}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            vitalStatus.isO2Low ? colors.critical.text : colors.text.primary
          }`}
        >
          O₂: {patient.vitals.oxygenLevel}%
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            vitalStatus.isHRHigh || vitalStatus.isHRLow
              ? colors.critical.text
              : colors.text.primary
          }`}
        >
          HR: {patient.vitals.heartRate} bpm
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${colors.text.secondary}`}
        >
          {formatTimestamp(patient.vitals.timestamp)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300
                     flex items-center justify-end gap-1"
          >
            {isExpanded ? (
              <>
                Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className={theme === "dark" ? "bg-slate-800/50" : "bg-gray-50"}>
          <td colSpan={9} className="px-6 py-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4
                  className={`text-sm font-medium ${colors.text.primary} mb-2`}
                >
                  Medical History
                </h4>
                <ul className="space-y-1">
                  {medicalHistory.map((condition, index) => (
                    <li
                      key={index}
                      className={`text-sm ${colors.text.secondary}`}
                    >
                      • {condition}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4
                  className={`text-sm font-medium ${colors.text.primary} mb-2`}
                >
                  Vital Trends
                </h4>
                <div className={`text-sm ${colors.text.secondary}`}>
                  Trends visualization coming soon...
                </div>
              </div>

              <div>
                <h4
                  className={`text-sm font-medium ${colors.text.primary} mb-2`}
                >
                  Notes
                </h4>
                <textarea
                  className={`w-full h-24 px-3 py-2 text-sm rounded-md
                            ${
                              theme === "dark"
                                ? "bg-slate-700 border-0 text-white placeholder-gray-400"
                                : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
                            }
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Add notes..."
                />
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-6">
              {patient.fallRisk && (
                <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Fall Risk</span>
                </div>
              )}
              {patient.isolation && (
                <div className="flex items-center text-purple-500 dark:text-purple-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">Isolation Required</span>
                </div>
              )}
              {patient.npo && (
                <div className="flex items-center text-red-500 dark:text-red-400">
                  <Ban className="w-4 h-4 mr-2" />
                  <span className="text-sm">NPO (Nothing by Mouth)</span>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default PatientRow;
