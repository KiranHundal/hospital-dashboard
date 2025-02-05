import { PatientInfo } from "./PatientInfo";
import type { Patient } from "../../../types/patient";
import { styles } from "../../../styles";

interface PatientInfoSectionProps {
  patient: Patient;
}

export const PatientInfoSection = ({ patient }: PatientInfoSectionProps) => (
  <div className={styles.patient.info.section}>
    <PatientInfo label="ID" value={patient.id} />
    <PatientInfo label="Room" value={patient.room} />
    <PatientInfo label="Age" value={`${patient.age} • ${patient.gender}`} />
  </div>
);
