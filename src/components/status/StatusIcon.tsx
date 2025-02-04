import type { LucideIcon } from "lucide-react";

interface StatusIconProps {
  condition?: boolean;
  icon: LucideIcon;
  label: string;
  color: string;
}

export const StatusIcon = ({
  condition = false,
  icon: Icon,
  label,
  color
}: StatusIconProps): JSX.Element | null =>
  condition ? (
    <Icon
      className={`w-5 h-5 ${color}`}
      aria-label={label}
    />
  ) : null;
