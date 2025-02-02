import { memo } from 'react';
import { TrendingDown, TrendingUp, Thermometer, Droplet, Heart } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { CriticalPatients } from '../../types/dashboard';

export interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  highlight?: boolean;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
}

export const StatCard = memo(({
  title,
  value,
  description,
  highlight = false,
  trend,
  icon,
}: StatCardProps) => {
  const { theme } = useTheme();

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <TrendingUp className="text-yellow-500" size={20} />;
    if (trend === 'down') return <TrendingDown className="text-green-500" size={20} />;
    return null;
  };

  return (
    <div
      className={`
        p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow
        ${highlight ? 'border-l-4 border-red-500 animate-pulse' : 'border border-gray-100'}
        ${trend === 'up' ? 'border-r-4 border-yellow-500' : ''}
        ${trend === 'down' ? 'border-r-4 border-green-500' : ''}
        ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export interface CriticalStatsProps {
  stats: {
    criticalPatients: CriticalPatients;
  };
  highlight?: boolean;
}

export const CriticalStats = memo(({ stats, highlight = false }: CriticalStatsProps) => {
  const { theme } = useTheme();

  const criticalDetails = [
    { label: 'High BP', value: stats.criticalPatients.highBP, icon: <Thermometer size={16} /> },
    { label: 'Low O₂', value: stats.criticalPatients.lowO2, icon: <Droplet size={16} /> },
    { label: 'Low HR', value: stats.criticalPatients.lowHR, icon: <Heart size={16} /> },
  ];

  const totalCritical = criticalDetails.reduce((sum, detail) => sum + detail.value, 0);

  return (
    <div
      className={`
        p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500
        ${highlight ? 'animate-pulse' : 'border border-gray-100'}
        ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-500">Critical Vitals</h3>
          <p className="mt-2 text-2xl font-bold text-red-600">{totalCritical}</p>
          <p className="mt-1 text-sm text-gray-500">Requires Attention</p>
        </div>
        <div className="ml-12">
          <ul className="space-y-2">
            {criticalDetails.map((detail) => (
              <li key={detail.label} className="flex items-center text-sm">
                <span className="text-gray-400 mr-2">{detail.icon}</span>
                <span className="text-gray-600 w-16">{detail.label}</span>
                <span className={`font-medium ${detail.value > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {detail.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

CriticalStats.displayName = 'CriticalStats';
