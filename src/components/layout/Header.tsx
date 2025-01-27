import { useEffect, useState } from 'react';
import { ConnectionStatus } from '../ui/ConnectionStatus';
import { getBuildInfo } from '../../utils/getBuildInfo';

interface HeaderProps {
  patientCount: number;
  isConnected: boolean;
  lastUpdate?: string;
}

export const Header = ({ isConnected, lastUpdate }: HeaderProps) => {
  const [buildInfo, setBuildInfo] = useState<{ version: string; buildTime: string } | null>(null);

  useEffect(() => {
    getBuildInfo().then((info) => setBuildInfo(info));
  }, []);

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        {/* <p className="mt-2 text-sm text-gray-600">Monitoring {patientCount} patients</p> */}
        {lastUpdate && (
          <p className="text-sm text-gray-500">Last update: {lastUpdate}</p>
        )}
        {buildInfo && (
          <p className="text-xs text-gray-500 mt-1">
            Version {buildInfo.version} • Built {new Date(buildInfo.buildTime).toLocaleDateString()}
          </p>
        )}
      </div>

      <ConnectionStatus isConnected={isConnected} />
    </div>
  );
};
