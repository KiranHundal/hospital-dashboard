import { AlertTriangle, Shield, Ban } from "lucide-react";
import { StatusListItem } from "./StatusListItem";
import type { Patient } from "../../../types/patient";

type PatientStatusSectionProps = Pick<
  Patient,
  "fallRisk" | "isolation" | "npo"
>;

export const PatientStatusSection = ({
  fallRisk,
  isolation,
  npo,
}: PatientStatusSectionProps) => (
  <div>
    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
      Patient Status
    </h4>
    <ul className="space-y-2">
      {fallRisk && (
        <StatusListItem
          icon={AlertTriangle}
          text="Fall Risk"
          color="text-yellow-600 dark:text-yellow-400"
        />
      )}
      {isolation && (
        <StatusListItem
          icon={Shield}
          text="Isolation Required"
          color="text-purple-600 dark:text-purple-400"
        />
      )}
      {npo && (
        <StatusListItem
          icon={Ban}
          text="NPO (Nothing by Mouth)"
          color="text-red-600 dark:text-red-400"
        />
      )}
    </ul>
  </div>
);
