import { Patient } from '../../types/patient';
import { usePatientStats } from '../../hooks/usePatientStats';
import { UI_CONFIG } from '../../config/constants';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  highlight?: boolean;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;

}
interface PatientSummaryProps {
    patients: Patient[];
    className?: string;
  }

const StatCard = ({ title, value, description, highlight, trend }: StatCardProps) => (
  <div
    className={`
      p-4 bg-white rounded-lg shadow
      ${highlight ? 'border-l-4 border-red-500' : 'border border-gray-200'}
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
  const criticalDetails = [
    { label: 'High BP', value: stats.criticalPatients.highBP },
    { label: 'Low O₂', value: stats.criticalPatients.lowO2 },
    { label: 'Low HR', value: stats.criticalPatients.lowHR },
  ];

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


        <div
  className={`
    flex items-center p-6 bg-white rounded-lg shadow
    border-l-4 border-red-500
  `}
>
  <div className="flex-1">
    <h3 className="text-sm font-medium text-gray-500">Critical Vitals</h3>
    <p className="mt-2 text-2xl font-semibold text-gray-900">
      {stats.criticalPatients.highBP + stats.criticalPatients.lowO2 + stats.criticalPatients.lowHR}
    </p>
    <p className="mt-2 text-sm text-gray-500">Requires Attention</p>
  </div>

  <div className="h-full w-px bg-gray-300 mx-4"></div>

   <ul className="flex flex-col space-y-2">
            {criticalDetails.map(detail => (
              <li key={detail.label} className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{detail.label}</span>
                <span className={`font-bold ${detail.value > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {detail.value}
                </span>
              </li>
            ))}
          </ul>
</div>


      </div>
    </div>
  );
};
