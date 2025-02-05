import React from "react";
import { AlertTriangle } from "lucide-react";
import { Patient } from "../../../types/patient";
import { colorStyles, styles } from "../../../styles";
import clsx from "clsx";

interface VitalsComparisonProps {
  patient: Patient;
  comparisonPatient?: Patient | null;
}

const VitalsComparison: React.FC<VitalsComparisonProps> = ({
  patient,
  comparisonPatient,
}) => {
  const calculateDifference = (val1: number, val2: number) => {
    if (!val1 || !val2) return 0;
    return ((val1 - val2) / val2) * 100;
  };

  const isSignificantDifference = (
    difference: number,
    threshold: number = 10
  ) => {
    return Math.abs(difference) > threshold;
  };

  const getValueColor = (value: number, low: number, high: number) => {
    if (value < low) return "text-blue-600 dark:text-blue-400";
    if (value > high) return "text-red-600 dark:text-red-400";
    return "text-green-600 dark:text-green-400";
  };

  const getComparisonIndicator = (current: number, comparison: number) => {
    const diff = calculateDifference(current, comparison);
    if (Math.abs(diff) < 2) return null;

    return (
      <span
        className={clsx(
          "ml-2 text-sm",
          diff > 0
            ? colorStyles.vitals.difference.increase
            : colorStyles.vitals.difference.decrease
        )}
      >
        {diff > 0 ? "↑" : "↓"} {Math.abs(diff).toFixed(1)}%
      </span>
    );
  };

  const vitals = patient.vitals;
  const comparisonVitals = comparisonPatient?.vitals;

  return (
    <div className={styles.comparison.container}>
      <h3 className={clsx(styles.comparison.header, colorStyles.text.primary)}>
        Vital Signs
      </h3>

      <div className="space-y-4">
        <div className={styles.comparison.content.row}>
          <span className={colorStyles.text.muted}>Blood Pressure</span>
          <div className={styles.comparison.content.value}>
            <span
              className={getValueColor(
                parseInt(vitals.bloodPressure.split("/")[0]),
                90,
                140
              )}
            >
              {vitals.bloodPressure}
            </span>
            {comparisonVitals && (
              <div
                className={clsx(
                  styles.comparison.content.comparison,
                  colorStyles.text.secondary
                )}
              >
                vs {comparisonVitals.bloodPressure}
                {getComparisonIndicator(
                  parseInt(vitals.bloodPressure.split("/")[0]),
                  parseInt(comparisonVitals.bloodPressure.split("/")[0])
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.comparison.content.row}>
          <span className={colorStyles.text.muted}>Heart Rate</span>
          <div className={styles.comparison.content.value}>
            <span className={getValueColor(vitals.heartRate, 60, 100)}>
              {vitals.heartRate} bpm
            </span>
            {comparisonVitals && (
              <div
                className={clsx(
                  styles.comparison.content.comparison,
                  colorStyles.text.secondary
                )}
              >
                vs {comparisonVitals.heartRate}
                {getComparisonIndicator(
                  vitals.heartRate,
                  comparisonVitals.heartRate
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.comparison.content.row}>
          <span className={colorStyles.text.muted}>SpO2</span>
          <div className={styles.comparison.content.value}>
            <span className={getValueColor(vitals.oxygenLevel, 95, 100)}>
              {vitals.oxygenLevel}%
            </span>
            {comparisonVitals && (
              <div
                className={clsx(
                  styles.comparison.content.comparison,
                  colorStyles.text.secondary
                )}
              >
                vs {comparisonVitals.oxygenLevel}
                {getComparisonIndicator(
                  vitals.oxygenLevel,
                  comparisonVitals.oxygenLevel
                )}
              </div>
            )}
          </div>
        </div>

        {comparisonVitals &&
          (isSignificantDifference(
            calculateDifference(vitals.heartRate, comparisonVitals.heartRate)
          ) ||
            isSignificantDifference(
              calculateDifference(
                vitals.oxygenLevel,
                comparisonVitals.oxygenLevel
              )
            )) && (
            <div className={styles.comparison.alert.container}>
              <AlertTriangle
                className={styles.comparison.alert.icon}
                size={20}
              />
              <span className={styles.comparison.alert.text}>
                Significant differences detected in vital signs
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default VitalsComparison;
