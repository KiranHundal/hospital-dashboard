import React, { useState, useCallback, memo } from "react";
import {
  AlertTriangle,
  Ban,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { useVitalSigns } from "../../hooks/useVitalSigns";
import { StatusIcon } from "./status/StatusIcon";
import { PatientStatusSection } from "./status/PatientStatusSection";
import { PatientVitals } from "./vitals/PatientVitals";
import { PatientInfoSection } from "./info/PatientInfoSection";
import { PatientNotes } from "./info/PatientNotes";
import type { Patient } from "../../types/patient";

interface ExpandablePatientCardProps {
  patient: Patient;
  isUpdated?: boolean;
  onNotesChange?: (notes: string) => void;
  defaultExpanded?: boolean;
}

const ExpandablePatientCardBase = ({
  patient,
  isUpdated = false,
  onNotesChange,
  defaultExpanded = false,
}: ExpandablePatientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [notes, setNotes] = useState("");
  const vitalStatus = useVitalSigns(patient?.vitals);

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newNotes = e.target.value;
      setNotes(newNotes);
      onNotesChange?.(newNotes);
    },
    [onNotesChange]
  );

  if (!patient || !patient.vitals) {
    return <div className="p-4 text-red-500">Invalid patient data</div>;
  }

  const isCritical = vitalStatus.severityScore > 0;
  const formattedTime = patient?.vitals?.timestamp
    ? new Date(Number(patient.vitals.timestamp)).toLocaleTimeString()
    : "Unknown";

  return (
    <div
      className={`
        relative rounded-lg shadow-sm bg-white dark:bg-gray-800
        ${isUpdated ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
      `}
      style={{ isolation: "isolate" }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold dark:text-white">
              {patient.name}
            </span>
            {isCritical && (
              <span
                role="status"
                className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              >
                Critical
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <StatusIcon
              condition={patient.fallRisk}
              icon={AlertTriangle}
              label="Fall Risk"
              color="text-yellow-500"
            />
            <StatusIcon
              condition={patient.isolation}
              icon={Shield}
              label="Isolation Required"
              color="text-purple-500"
            />
            <StatusIcon
              condition={patient.npo}
              icon={Ban}
              label="NPO (Nothing by Mouth)"
              color="text-red-500"
            />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <PatientInfoSection patient={patient} />
        <PatientVitals vitals={patient.vitals} vitalStatus={vitalStatus} />

        <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Last updated: {formattedTime}
        </div>
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isExpanded ? "max-h-96" : "max-h-0"}
        `}
        data-testid="expandable-section"
      >
        <div className="p-4 border-t dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <PatientStatusSection
              fallRisk={patient.fallRisk}
              isolation={patient.isolation}
              npo={patient.npo}
            />
            <PatientNotes value={notes} onChange={handleNotesChange} />
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Vital Trends
            </h4>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trends visualization coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExpandablePatientCard = memo(ExpandablePatientCardBase);
export default ExpandablePatientCard;
