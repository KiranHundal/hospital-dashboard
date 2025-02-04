import { BuildInfoProps } from "../../types/header";

export const BuildInfo = ({ version, buildTime }: BuildInfoProps) => (
  <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
    <div className="text-xs text-gray-500 dark:text-gray-400">
      Version {version} • Built {new Date(buildTime).toLocaleDateString()}
    </div>
  </div>
);
