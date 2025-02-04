import { Loader } from "lucide-react";

export const LoadingButton = () => (
    <button
      disabled
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-400 dark:bg-gray-800"
    >
      <Loader className="w-4 h-4 mr-2 animate-spin" />
      Connecting...
    </button>
   );
