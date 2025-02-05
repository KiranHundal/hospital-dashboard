import { AlertTriangle, Shield, Ban } from "lucide-react";
import { StatusListItem } from "./StatusListItem";
import type { Patient } from "../../../types/patient";
import { styles } from "../../../styles";

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
    <h4 className={styles.status.container.title}>Patient Status</h4>
    <ul className={styles.status.container.list}>
      {fallRisk && (
        <StatusListItem
          icon={AlertTriangle}
          text="Fall Risk"
          color={styles.status.icon.yellow}
        />
      )}
      {isolation && (
        <StatusListItem
          icon={Shield}
          text="Isolation Required"
          color={styles.status.icon.purple}
        />
      )}
      {npo && (
        <StatusListItem
          icon={Ban}
          text="NPO (Nothing by Mouth)"
          color={styles.status.icon.red}
        />
      )}
    </ul>
  </div>
);
