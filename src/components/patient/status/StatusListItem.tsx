import { AlertTriangle } from "lucide-react";
import { styles } from "../../../styles";
import clsx from "clsx";

interface StatusListItemProps {
  icon: typeof AlertTriangle;
  text: string;
  color: string;
}

export const StatusListItem = ({
  icon: Icon,
  text,
  color,
}: StatusListItemProps) => (
  <li className={clsx(styles.status.item.base, color)}>
    <Icon className={styles.status.item.icon} />
    {text}
  </li>
);
