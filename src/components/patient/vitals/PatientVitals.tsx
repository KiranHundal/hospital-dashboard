import { VitalSign } from "./VitalSign";
import type { Patient } from "../../../types/patient";
import { VitalStatus } from "../../../services/VitalSignsService";
import { styles } from "../../../styles";

interface PatientVitalsProps {
  vitals: Patient["vitals"];
  vitalStatus: VitalStatus;
}

export const PatientVitals = ({ vitals, vitalStatus }: PatientVitalsProps) => (
  <div className={styles.vital.container}>
    <VitalSign
      label="BP"
      value={vitals.bloodPressure}
      isAbnormal={vitalStatus.isBPHigh || vitalStatus.isBPLow}
    />
    <VitalSign
      label="HR"
      value={vitals.heartRate}
      isAbnormal={vitalStatus.isHRHigh || vitalStatus.isHRLow}
      unit=" bpm"
    />
    <VitalSign
      label="O₂"
      value={vitals.oxygenLevel}
      isAbnormal={vitalStatus.isO2Low}
      unit="%"
    />
  </div>
);
