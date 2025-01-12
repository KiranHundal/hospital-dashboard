import { Patient } from '../../types/patient';
import { usePatientStats } from '../../hooks/usePatientStats';
import { UI_CONFIG } from '../../config/constants';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  highlight?: boolean;
  trend?: 'up' | 'down' | 'stable';
}

const StatCard = ({ title, value, description, highlight, trend }: StatCardProps) => (
  <div
    className={`
      p-4 bg-white rounded-lg shadow
      ${highlight ? 'border-l-4 border-red-500' : ''}
      ${trend === 'up' ? 'border-r-4 border-yellow-500' : ''}
      ${trend === 'down' ? 'border-r-4 border-green-500' : ''}
    `}
  >
    <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
    <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    {description && (
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    )}
  </div>
);

interface PatientSummaryProps {
  patients: Patient[];
  className?: string;
}

export const PatientSummary = ({ patients, className = '' }: PatientSummaryProps) => {
  const stats = usePatientStats(patients);

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Statistics</h2>
      <div className={`
        grid gap-4
        grid-cols-${UI_CONFIG.GRID_BREAKPOINTS.MOBILE}
        md:grid-cols-${UI_CONFIG.GRID_BREAKPOINTS.TABLET}
        lg:grid-cols-${UI_CONFIG.GRID_BREAKPOINTS.DESKTOP}
      `}>
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
        />
        <StatCard
          title="Average Age"
          value={`${stats.averageAge} years`}
        />
        <StatCard
          title="Gender Distribution"
          value={`${stats.genderDistribution.male}M / ${stats.genderDistribution.female}F`}
          description="Male / Female"
        />
        <StatCard
          title="Critical Vitals"
          value={stats.criticalPatients.highBP + stats.criticalPatients.lowO2}
          description="Requires Attention"
          highlight={stats.criticalPatients.highBP + stats.criticalPatients.lowO2 > 0}
        />
        <StatCard
          title="High Blood Pressure"
          value={stats.criticalPatients.highBP}
          highlight={stats.criticalPatients.highBP > 0}
        />
        <StatCard
          title="Low Oxygen"
          value={stats.criticalPatients.lowO2}
          highlight={stats.criticalPatients.lowO2 > 0}
        />
      </div>
    </div>
  );
};
