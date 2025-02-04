import { ViewButtonProps } from "../../types/header";

export const ViewButton = ({
  onClick,
  isActive,
  icon,
  label,
}: ViewButtonProps) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded ${
      isActive
        ? "bg-white dark:bg-gray-700 shadow-sm"
        : "hover:bg-gray-200 dark:hover:bg-gray-600"
    }`}
    aria-label={label}
  >
    {icon}
  </button>
);
