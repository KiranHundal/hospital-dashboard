import { VitalSigns } from '../../types/patient';

interface VitalsDisplayProps {
  vitals: VitalSigns;
  isUpdated?: boolean;
}

export const VitalsDisplay = ({ vitals, isUpdated }: VitalsDisplayProps) => (
  <div className={`space-y-1 ${isUpdated ? 'animate-pulse' : ''}`}>
    <div className="flex items-center justify-between">
      <span>BP:</span>
      <span className="font-medium">{vitals.bloodPressure}</span>
    </div>
    <div className="flex items-center justify-between">
      <span>HR:</span>
      <span className="font-medium">{vitals.heartRate} bpm</span>
    </div>
    <div className="flex items-center justify-between">
      <span>O₂:</span>
      <span className="font-medium">{vitals.oxygenLevel}%</span>
    </div>
  </div>
);
