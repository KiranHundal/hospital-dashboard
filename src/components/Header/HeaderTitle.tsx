import { HeaderTitleProps } from "../../types/header";

export const HeaderTitle = ({
  isConnected,
  formattedDate,
}: HeaderTitleProps) => (
  <div className="flex flex-col">
    <div className="flex items-center space-x-3">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        Hospital Patient Dashboard
      </h1>
      {isConnected && <ConnectionStatus />}
    </div>
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {formattedDate}
    </span>
  </div>
);

export const ConnectionStatus = () => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
    <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
    Connected
  </span>
);
