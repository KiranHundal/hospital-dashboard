import { styles } from "../../../styles";
import clsx from "clsx";

interface VitalSignProps {
  label: string;
  value: string | number;
  isAbnormal: boolean;
  unit?: string;
}

export const VitalSign = ({
  label,
  value,
  isAbnormal,
  unit = "",
}: VitalSignProps) => (
  <div
    className={clsx(
      styles.vital.sign.base,
      isAbnormal ? styles.vital.sign.abnormal : styles.vital.sign.normal
    )}
  >
    <span className={styles.vital.sign.label}>{label}:</span> {value}
    {unit}
  </div>
);
