import type { LucideIcon } from "lucide-react";
import { styles } from "../../../styles";
import clsx from "clsx";

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
  color,
}: StatusIconProps): JSX.Element | null =>
  condition ? (
    <Icon className={clsx(styles.status.icon.base, color)} aria-label={label} />
  ) : null;
