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
    className={`
      text-sm
      ${
        isAbnormal
          ? "text-red-600 dark:text-red-400"
          : "text-gray-600 dark:text-gray-300"
      }
    `}
  >
    <span className="font-medium">{label}:</span> {value}
    {unit}
  </div>
);
