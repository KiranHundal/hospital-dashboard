import React from "react";
import { PaginationControls } from "../../ui/PaginationControls";
import ExpandablePatientCard from "../../patient/ExpandablePatientCard";
import { PatientGridProps } from "../../../types/dashboard";

export const PatientGrid: React.FC<PatientGridProps> = ({
  patients,
  updatedPatientId,
  pagination,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        {patients.map((patient) => (
          <ExpandablePatientCard
            key={patient.id}
            patient={patient}
            isUpdated={patient.id === updatedPatientId}
          />
        ))}
      </div>
      <PaginationControls {...pagination} />
    </div>
  );
};
