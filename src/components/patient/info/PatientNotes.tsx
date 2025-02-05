import React from "react";
import { styles } from "../../../styles";

interface PatientNotesProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PatientNotes = ({ value, onChange }: PatientNotesProps) => (
  <div className={styles.patient.notes.container}>
    <h4 className={styles.patient.notes.title}>Notes</h4>
    <textarea
      value={value}
      onChange={onChange}
      className={styles.patient.notes.textarea}
      placeholder="Add notes..."
      aria-label="Patient notes"
    />
  </div>
);
