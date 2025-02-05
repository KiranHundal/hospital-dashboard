import { styles } from "../../../styles";

interface PatientInfoProps {
  label: string;
  value: string;
}

export const PatientInfo = ({ label, value }: PatientInfoProps) => (
  <div className={styles.patient.info.container}>
    <span className={styles.patient.info.label}>{label}:</span>
    <span className={styles.patient.info.value}>{value}</span>
  </div>
);
