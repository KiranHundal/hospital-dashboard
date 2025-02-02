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
