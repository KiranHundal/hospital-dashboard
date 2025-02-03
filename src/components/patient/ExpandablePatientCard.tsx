import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Shield,
  Ban,
} from "lucide-react";
import { useVitalSigns } from "../../hooks/useVitalSigns";
import { Patient } from "../../types/patient";

interface ExpandablePatientCardProps {
  patient: Patient;
  isUpdated?: boolean;
}

const ExpandablePatientCard = ({
  patient,
  isUpdated,
}: ExpandablePatientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const vitalStatus = useVitalSigns(patient.vitals);
  const isCritical = vitalStatus.severityScore > 0;

  return (
    <div
      className={`
      rounded-lg shadow-sm overflow-hidden
      transition-all duration-300 ease-in-out
      ${isUpdated ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
      dark:bg-gray-800 bg-white
    `}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold dark:text-white">
              {patient.name}
            </span>
            {isCritical && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Critical
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {patient.fallRisk && (
              <AlertTriangle
                className="w-5 h-5 text-yellow-500"
                title="Fall Risk"
              />
            )}
            {patient.isolation && (
              <Shield
                className="w-5 h-5 text-purple-500"
                title="Isolation Required"
              />
            )}
            {patient.npo && (
              <Ban
                className="w-5 h-5 text-red-500"
                title="NPO (Nothing by Mouth)"
              />
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">ID:</span>
            <span className="ml-2 font-medium dark:text-white">
              {patient.id}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Room:</span>
            <span className="ml-2 font-medium dark:text-white">
              {patient.room}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Age:</span>
            <span className="ml-2 font-medium dark:text-white">
              {patient.age} • {patient.gender}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-4">
          <div
            className={`text-sm ${
              vitalStatus.isBPHigh || vitalStatus.isBPLow
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <span className="font-medium">BP:</span>{" "}
            {patient.vitals.bloodPressure}
          </div>
          <div
            className={`text-sm ${
              vitalStatus.isHRHigh || vitalStatus.isHRLow
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <span className="font-medium">HR:</span> {patient.vitals.heartRate}{" "}
            bpm
          </div>
          <div
            className={`text-sm ${
              vitalStatus.isO2Low
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <span className="font-medium">O₂:</span>{" "}
            {patient.vitals.oxygenLevel}%
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Last updated:{" "}
          {new Date(patient.vitals.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div
        className={`
        overflow-hidden transition-all duration-300
        ${isExpanded ? "max-h-96" : "max-h-0"}
      `}
      >
        <div className="p-4 border-t dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Patient Status
              </h4>
              <ul className="space-y-2">
                {patient.fallRisk && (
                  <li className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Fall Risk
                  </li>
                )}
                {patient.isolation && (
                  <li className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                    <Shield className="w-4 h-4 mr-2" />
                    Isolation Required
                  </li>
                )}
                {patient.npo && (
                  <li className="flex items-center text-sm text-red-600 dark:text-red-400">
                    <Ban className="w-4 h-4 mr-2" />
                    NPO (Nothing by Mouth)
                  </li>
                )}
              </ul>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Notes
              </h4>
              <textarea
                className="w-full h-24 px-3 py-2 text-sm border rounded-md
                          dark:bg-gray-700 dark:border-gray-600 dark:text-white
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add notes..."
              />
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Vital Trends
            </h4>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trends visualization coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandablePatientCard;
