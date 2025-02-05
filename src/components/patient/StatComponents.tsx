import { memo } from "react";
import {
  TrendingDown,
  TrendingUp,
  Thermometer,
  Droplet,
  Heart,
} from "lucide-react";
import { CriticalPatients } from "../../types/dashboard";
import { styles } from "../../styles";
import clsx from "clsx";

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
    const getTrendIcon = () => {
      if (!trend) return null;
      if (trend === "up")
        return (
          <TrendingUp
            className={styles.stat.critical.details.icon.red}
            size={20}
          />
        );
      if (trend === "down")
        return (
          <TrendingDown
            className={styles.stat.critical.details.icon.blue}
            size={20}
          />
        );
      return null;
    };

    const getBorderStyle = () => {
      if (highlight) return styles.stat.card.borders.highlight;
      if (trend === "up") return styles.stat.card.borders.trend.up;
      if (trend === "down") return styles.stat.card.borders.trend.down;
      return styles.stat.card.borders.default;
    };
    return (
      <div
        className={clsx(
          styles.stat.card.base,
          getBorderStyle(),
          highlight
            ? styles.stat.card.backgrounds.highlight
            : styles.stat.card.backgrounds.default,
          onClick && "cursor-pointer hover:shadow-md",
          className
        )}
        onClick={onClick}
      >
        <div className={styles.stat.card.container}>
          <div className={styles.stat.card.content.wrapper}>
            <div className="flex-1">
              <h3 className={styles.stat.card.content.header}>{title}</h3>
              <p
                className={clsx(
                  styles.stat.card.content.value,
                  highlight
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-900 dark:text-gray-100"
                )}
              >
                {value}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              {icon && (
                <div className="text-gray-400 dark:text-gray-500">{icon}</div>
              )}
            </div>
          </div>
          {description && (
            <p className={styles.stat.card.content.description}>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

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
        color: styles.stat.critical.details.icon.red,
        filterKey: "highBP",
      },
      {
        label: "Low O₂",
        value: stats.criticalPatients.lowO2,
        icon: <Droplet size={16} />,
        color: styles.stat.critical.details.icon.blue,
        filterKey: "lowOxygen",
      },
      {
        label: "Low HR",
        value: stats.criticalPatients.lowHR,
        icon: <Heart size={16} />,
        color: styles.stat.critical.details.icon.pink,
        filterKey: "abnormalHeartRate",
      },
    ].filter((detail) => detail.value > 0);

    const totalCritical = criticalDetails.reduce(
      (sum, detail) => sum + detail.value,
      0
    );

    return (
      <div
        className={clsx(
          styles.stat.critical.container,
          highlight
            ? styles.stat.card.backgrounds.highlight
            : styles.stat.card.backgrounds.default,
          onClick && "cursor-pointer hover:shadow-md"
        )}
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className={styles.stat.critical.header}>Critical Vitals</h3>
            <p className={styles.stat.critical.value}>{totalCritical}</p>
            <p className={styles.stat.card.content.description}>
              Requires Attention
            </p>
          </div>

          {criticalDetails.length > 0 && (
            <div className={styles.stat.critical.details.container}>
              {criticalDetails.map((detail) => (
                <div
                  key={detail.label}
                  className={styles.stat.critical.details.item}
                >
                  <span className={detail.color}>{detail.icon}</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {detail.label}
                  </span>
                  <span className={clsx("font-medium", detail.color)}>
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
