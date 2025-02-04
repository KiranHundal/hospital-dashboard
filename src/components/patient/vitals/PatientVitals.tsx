import { VitalSign } from "./VitalSign";
import type { Patient } from "../../../types/patient";
import { VitalStatus } from "../../../services/VitalSignsService";

interface PatientVitalsProps {
  vitals: Patient["vitals"];
  vitalStatus: VitalStatus;
}

export const PatientVitals = ({ vitals, vitalStatus }: PatientVitalsProps) => (
  <div className="mt-3 grid grid-cols-3 gap-4">
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
