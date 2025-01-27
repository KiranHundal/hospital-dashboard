import { Patient } from '../../types/patient';
import { usePatientStats } from '../../hooks/usePatientStats';
import { TrendingDown, TrendingUp, Users, Activity, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  highlight?: boolean;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  onClick?: () => void;
}

const StatCard = ({ title, value, description, highlight, trend, icon }: StatCardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ?
      <TrendingUp className="text-yellow-500" size={20} /> :
      trend === 'down' ?
        <TrendingDown className="text-green-500" size={20} /> :
        null;
  };

  return (
    <div className={`
      p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow
      ${highlight ? 'border-l-4 border-red-500' : 'border border-gray-100'}
      ${trend === 'up' ? 'border-r-4 border-yellow-500' : ''}
      ${trend === 'down' ? 'border-r-4 border-green-500' : ''}
    `}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </div>
    </div>
  );
};

interface CriticalStatsProps {
  stats: {
    criticalPatients: {
      highBP: number;
      lowO2: number;
      lowHR: number;
    };
  };
}

const CriticalStats = ({ stats }: CriticalStatsProps) => {
  const criticalDetails = [
    { label: 'High BP', value: stats.criticalPatients.highBP },
    { label: 'Low O₂', value: stats.criticalPatients.lowO2 },
    { label: 'Low HR', value: stats.criticalPatients.lowHR },
  ];

  const totalCritical = criticalDetails.reduce((sum, detail) => sum + detail.value, 0);


  return (
    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-500">Critical Vitals</h3>
          <p className="mt-2 text-2xl font-bold text-red-600">{totalCritical}</p>
          <p className="mt-1 text-sm text-gray-500">Requires Attention</p>
        </div>

        <div className="ml-12">
          <ul className="space-y-2">
            {criticalDetails.map(detail => (
              <li key={detail.label} className="flex items-center text-sm">
                <span className="text-gray-600 w-16">{detail.label}</span>
                <span className={`font-medium  ${detail.value > 0 ? 'text-red-600' : 'text-gray-500'}`}>
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

export const PatientSummary = ({ patients, className = '' }: { patients: Patient[]; className?: string }) => {
  const stats = usePatientStats(patients);

  // Calculate gender counts
  const maleCount = patients.filter(p => p.gender.toLowerCase() === 'male').length;
  const femaleCount = patients.filter(p => p.gender.toLowerCase() === 'female').length;

  return (
    <div className={`mb-8 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Average Age"
          value={`${stats.averageAge} years`}
          icon={<Clock size={24} />}
        />
        <StatCard
          title="Gender Distribution"
          value={`${maleCount}M / ${femaleCount}F`}
          description="Male / Female"
          icon={<Activity size={24} />}
        />
        <CriticalStats stats={stats} />
      </div>
    </div>
  );
};
