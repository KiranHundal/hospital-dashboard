import { memo } from "react";
import {
  TrendingDown,
  TrendingUp,
  Thermometer,
  Droplet,
  Heart,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { CriticalPatients } from "../../types/dashboard";

export interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  highlight?: boolean;
  trend?: "up" | "down" | "stable";
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StatCard = memo(
  ({
    title,
    value,
    description,
    highlight = false,
    trend,
    icon,
    className,
    onClick,
  }: StatCardProps) => {
    const { theme } = useTheme();

    const getTrendIcon = () => {
      if (!trend) return null;
      if (trend === "up")
        return <TrendingUp className="text-yellow-500" size={20} />;
      if (trend === "down")
        return <TrendingDown className="text-green-500" size={20} />;
      return null;
    };

    const getBorderColor = () => {
      if (highlight) return "border-l-4 border-red-500 dark:border-red-400";
      if (trend === "up")
        return "border-r-4 border-amber-500 dark:border-amber-400";
      if (trend === "down")
        return "border-r-4 border-emerald-500 dark:border-emerald-400";
      return "border border-gray-200 dark:border-gray-700";
    };
    return (
      <div
        className={`
          h-40 p-6 rounded-lg shadow-sm transition-all
          ${getBorderColor()}
          ${highlight ? 'animate-pulse bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-800'}
          ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
          ${className || ''}
        `}
        onClick={onClick}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                {title}
              </h3>
              <p className={`mt-2 text-2xl font-bold ${
                highlight ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {value}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
            </div>
          </div>
          {description && (
            <p className="mt-auto text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  });


StatCard.displayName = "StatCard";

export interface CriticalStatsProps {
  stats: {
    criticalPatients: CriticalPatients;
  };
  highlight?: boolean;
  onClick?: () => void;
}

export const CriticalStats = memo(
  ({ stats, highlight = false, onClick }: CriticalStatsProps) => {
    const criticalDetails = [
      {
        label: "High BP",
        value: stats.criticalPatients.highBP,
        icon: <Thermometer size={16} />,
        color: "text-red-500 dark:text-red-400",
        filterKey: "highBP",
      },
      {
        label: "Low O₂",
        value: stats.criticalPatients.lowO2,
        icon: <Droplet size={16} />,
        color: "text-blue-500 dark:text-blue-400",
        filterKey: "lowOxygen",
      },
      {
        label: "Low HR",
        value: stats.criticalPatients.lowHR,
        icon: <Heart size={16} />,
        color: "text-pink-500 dark:text-pink-400",
        filterKey: "abnormalHeartRate",
      },
    ].filter((detail) => detail.value > 0);

    const totalCritical = criticalDetails.reduce(
      (sum, detail) => sum + detail.value,
      0
    );

    return (
      <div
        className={`
        h-40 p-6 rounded-lg shadow-sm transition-all
        border-l-4 border-red-500 dark:border-red-400
        ${
          highlight
            ? "animate-pulse bg-red-50 dark:bg-red-900/20"
            : "bg-white dark:bg-gray-800"
        }
        ${onClick ? "cursor-pointer hover:shadow-md" : ""}
      `}
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Critical Vitals
            </h3>
            <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
              {totalCritical}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Requires Attention
            </p>
          </div>

          {criticalDetails.length > 0 && (
            <div className="space-y-3">
              {criticalDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className={`${detail.color}`}>{detail.icon}</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {detail.label}
                  </span>
                  <span className={`font-medium ${detail.color}`}>
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

CriticalStats.displayName = "CriticalStats";
