import { ConnectionStatus } from '../ui/ConnectionStatus';

interface HeaderProps {
  patientCount: number;
  isConnected: boolean;
  lastUpdate?: string;
}

export const Header = ({ patientCount, isConnected, lastUpdate }: HeaderProps) => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Monitoring {patientCount} patients
      </p>
      {lastUpdate && (
        <p className="text-sm text-gray-500">
          Last update: {lastUpdate}
        </p>
      )}
    </div>
    <ConnectionStatus isConnected={isConnected} />
  </div>
);
