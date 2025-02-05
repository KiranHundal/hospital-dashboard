import { useState } from 'react';
import { RefreshButtonProps } from '../../types/header';
import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';
import { buttonStyles } from '../../styles/shared';

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
      className={buttonStyles.variants.icon}
      aria-label="Refresh data"
    >
      <RefreshCw
        className={clsx(
          buttonStyles.icon.base,
          isSpinning && buttonStyles.icon.spinning
        )}
      />
    </button>
  );
};
