import { Patient } from "./patient";

export interface LayoutItem {
    id: string;
    type: 'stat' | 'critical';
    title: string;
    isLocked?: boolean;
  }

  export interface CriticalPatients {
    highBP: number;
    lowO2: number;
    lowHR: number;
  }

  export interface PatientStats {
    totalPatients: number;
    averageAge: number;
    criticalPatients: CriticalPatients;
  }
  export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
  }
export interface PatientListProps {
  patients: Patient[];
  updatedPatientId?: string;
  isLoading: boolean;
  error: Error | null;
  onResetSortChange: (resetSort: () => void) => void;
  pagination: PaginationProps;
}
export interface PatientGridProps {
  patients: Patient[];
  updatedPatientId?: string;
  pagination: PaginationProps;
}
