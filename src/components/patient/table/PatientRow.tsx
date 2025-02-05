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
import { buttonStyles, styles } from "../../../styles";
import clsx from "clsx";

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

  return (
    <>
      <tr
        className={clsx(
          styles.table.body.row.base,
          isUpdated && styles.table.body.row.updated,
          isCritical && styles.table.body.row.critical,
          theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50"
        )}
      >
        <td className={styles.table.body.cell.base}>
          <div className="flex items-center space-x-2">
            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
              {patient.id}
            </span>
            {isCritical && (
               <span className={styles.expandable.card.header.badge}>
               Critical
             </span>
            )}
          </div>
        </td>
        <td className={styles.table.body.cell.base}>
          <span className={colors.text.primary}>{patient.name}</span>
        </td>
        <td className={styles.table.body.cell.base}>
          <span className={colors.text.primary}>{patient.room}</span>
        </td>
        <td className={styles.table.body.cell.base}>
          <div className={colors.text.primary}>{patient.age}</div>
          <div className={colors.text.secondary}>{patient.gender}</div>
        </td>
        <td
          className={clsx(
            styles.table.body.cell.base,
            vitalStatus.isBPHigh || vitalStatus.isBPLow
              ? colors.critical.text
              : colors.text.primary
          )}
        >
          BP: {patient.vitals.bloodPressure}
        </td>
        <td
          className={clsx(
            styles.table.body.cell.base,
            vitalStatus.isO2Low ? colors.critical.text : colors.text.primary
          )}
        >
          O₂: {patient.vitals.oxygenLevel}%
        </td>
        <td
          className={clsx(
            styles.table.body.cell.base,
            vitalStatus.isHRHigh || vitalStatus.isHRLow
              ? colors.critical.text
              : colors.text.primary
          )}
        >
          HR: {patient.vitals.heartRate} bpm
        </td>
        <td
          className={clsx(styles.table.body.cell.base, colors.text.secondary)}
        >
          {formatTimestamp(patient.vitals.timestamp)}
        </td>
        <td className={styles.table.body.cell.action}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={buttonStyles.patient.action}
          >
            {isExpanded ? (
              <>
                Less <ChevronUp className={buttonStyles.icon.base} />
              </>
            ) : (
              <>
                More <ChevronDown className={buttonStyles.icon.base} />
              </>
            )}
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className={styles.table.body.row.expanded}>
          <td colSpan={9} className={styles.table.expanded.section}>
            <div className={styles.table.expanded.grid}>
              <div>
                <h4
                  className={clsx(
                    styles.table.expanded.title,
                    colors.text.primary
                  )}
                >
                  Medical History
                </h4>
                <ul className="space-y-1">
                  {medicalHistory.map((condition, index) => (
                    <li
                      key={index}
                      className={clsx(
                        styles.table.expanded.content,
                        colors.text.secondary
                      )}
                    >
                      • {condition}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4
                  className={clsx(
                    styles.table.expanded.title,
                    colors.text.primary
                  )}
                >
                  Vital Trends
                </h4>
                <div
                  className={clsx(
                    styles.table.expanded.content,
                    colors.text.secondary
                  )}
                >
                  Trends visualization coming soon...
                </div>
              </div>

              <div>
                <h4
                  className={clsx(
                    styles.table.expanded.title,
                    colors.text.primary
                  )}
                >
                  Notes
                </h4>
                <textarea
                  className={clsx(
                    "w-full h-24 px-3 py-2 text-sm rounded-md",
                    theme === "dark"
                      ? "bg-slate-700 border-0 text-white placeholder-gray-400"
                      : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500",
                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  )}
                  placeholder="Add notes..."
                />
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-6">
              {patient.fallRisk && (
                <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                  <AlertTriangle className={buttonStyles.icon.base} />
                  <span className="text-sm ml-2">Fall Risk</span>
                </div>
              )}
              {patient.isolation && (
                <div className="flex items-center text-purple-500 dark:text-purple-400">
                  <Shield className={buttonStyles.icon.base} />
                  <span className="text-sm ml-2">Isolation Required</span>
                </div>
              )}
              {patient.npo && (
                <div className="flex items-center text-red-500 dark:text-red-400">
                  <Ban className={buttonStyles.icon.base} />
                  <span className="text-sm ml-2">NPO (Nothing by Mouth)</span>
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
