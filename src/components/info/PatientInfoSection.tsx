import { PatientInfo } from './PatientInfo';
import type { Patient } from '../../types/patient';

interface PatientInfoSectionProps {
  patient: Patient;
}

export const PatientInfoSection = ({ patient }: PatientInfoSectionProps) => (
  <div className="mt-2 grid grid-cols-3 gap-4">
    <PatientInfo label="ID" value={patient.id} />
    <PatientInfo label="Room" value={patient.room} />
    <PatientInfo
      label="Age"
      value={`${patient.age} • ${patient.gender}`}
    />
  </div>
);
