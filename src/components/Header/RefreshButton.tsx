import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface RefreshButtonProps {
  onClick: () => void | Promise<void>;
}

export const RefreshButton = ({ onClick }: RefreshButtonProps) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = async () => {
    setIsSpinning(true);
    try {
      await onClick();
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setTimeout(() => setIsSpinning(false), 500);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Refresh data"
    >
      <RefreshCw
        className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${
          isSpinning ? 'animate-spin' : ''
        }`}
      />
    </button>
  );
};
