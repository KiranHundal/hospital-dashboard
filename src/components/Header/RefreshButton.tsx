import { RefreshCw } from "lucide-react";
import { RefreshButtonProps } from "../../types/header";

   export const RefreshButton = ({ onClick }: RefreshButtonProps) => (
    <button
      onClick={onClick}
      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Refresh data"
    >
      <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    </button>
   );
