import React from "react";
import { AlertTriangle } from "lucide-react";
import { Patient } from "../../types/patient";

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
        className={`ml-2 text-sm ${
          diff > 0 ? "text-red-500" : "text-blue-500"
        }`}
      >
        {diff > 0 ? "↑" : "↓"} {Math.abs(diff).toFixed(1)}%
      </span>
    );
  };

  const vitals = patient.vitals;
  const comparisonVitals = comparisonPatient?.vitals;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Vital Signs</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">
            Blood Pressure
          </span>
          <div className="flex items-center">
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
              <div className="ml-4 text-sm text-gray-500">
                vs {comparisonVitals.bloodPressure}
                {getComparisonIndicator(
                  parseInt(vitals.bloodPressure.split("/")[0]),
                  parseInt(comparisonVitals.bloodPressure.split("/")[0])
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Heart Rate</span>
          <div className="flex items-center">
            <span className={getValueColor(vitals.heartRate, 60, 100)}>
              {vitals.heartRate} bpm
            </span>
            {comparisonVitals && (
              <div className="ml-4 text-sm text-gray-500">
                vs {comparisonVitals.heartRate}
                {getComparisonIndicator(
                  vitals.heartRate,
                  comparisonVitals.heartRate
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">SpO2</span>
          <div className="flex items-center">
            <span className={getValueColor(vitals.oxygenLevel, 95, 100)}>
              {vitals.oxygenLevel}%
            </span>
            {comparisonVitals && (
              <div className="ml-4 text-sm text-gray-500">
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
            <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-center">
              <AlertTriangle className="text-yellow-500 mr-2" size={20} />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                Significant differences detected in vital signs
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default VitalsComparison;
