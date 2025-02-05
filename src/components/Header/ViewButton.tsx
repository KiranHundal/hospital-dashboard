import { buttonStyles } from "../../styles/shared";
import { ViewButtonProps } from "../../types/header";
import clsx from "clsx"
export const ViewButton = ({
  onClick,
  isActive,
  icon,
  label,
}: ViewButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "p-1.5 rounded",
      isActive ? buttonStyles.states.active : buttonStyles.states.inactive
    )}
    aria-label={label}
  >
    {icon}
  </button>
);
