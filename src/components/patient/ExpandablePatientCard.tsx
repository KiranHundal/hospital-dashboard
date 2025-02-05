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
import { styles } from "../../styles";
import clsx from "clsx";

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
      className={clsx(
        styles.expandable.card.container,
        isUpdated && "ring-2 ring-blue-500 ring-opacity-50"
      )}
      style={{ isolation: "isolate" }}
    >
      <div className={styles.expandable.card.content.inner}>
        <div className={styles.expandable.card.header.wrapper}>
          <div className="flex items-center space-x-3">
            <span className={styles.expandable.card.header.title}>
              {patient.name}
            </span>
            {isCritical && (
              <span className={styles.expandable.card.header.badge}>
                Critical
              </span>
            )}
          </div>

          <div className={styles.expandable.card.header.controls}>
            <StatusIcon
              condition={patient.fallRisk}
              icon={AlertTriangle}
              label="Fall Risk"
              color={styles.status.icon.yellow}
            />
            <StatusIcon
              condition={patient.isolation}
              icon={Shield}
              label="Isolation Required"
              color={styles.status.icon.purple}
            />
            <StatusIcon
              condition={patient.npo}
              icon={Ban}
              label="NPO (Nothing by Mouth)"
              color={styles.status.icon.red}
            />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.expandable.card.header.expandButton}
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

        <div className={styles.expandable.card.content.timestamp}>
          Last updated: {formattedTime}
        </div>
      </div>

      <div
        className={clsx(
          styles.expandable.card.content.wrapper,
          isExpanded ? "max-h-96" : "max-h-0"
        )}
        data-testid="expandable-section"
      >
        <div className={styles.expandable.card.section.wrapper}>
          <div className={styles.expandable.card.content.grid}>
            <PatientStatusSection
              fallRisk={patient.fallRisk}
              isolation={patient.isolation}
              npo={patient.npo}
            />
            <PatientNotes value={notes} onChange={handleNotesChange} />
          </div>

          <div className={styles.expandable.card.trends.container}>
            <h4 className={styles.expandable.card.trends.title}>
              Vital Trends
            </h4>
            <div className={styles.expandable.card.trends.content}>
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
