interface PatientInfoProps {
    label: string;
    value: string;
  }

  export const PatientInfo = ({ label, value }: PatientInfoProps) => (
    <div className="text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}:</span>
      <span className="ml-2 font-medium dark:text-white">{value}</span>
    </div>
  );
