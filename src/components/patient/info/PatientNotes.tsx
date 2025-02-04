import React from 'react';

interface PatientNotesProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PatientNotes = ({ value, onChange }: PatientNotesProps) => (
  <div>
    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
      Notes
    </h4>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full h-24 px-3 py-2 text-sm border rounded-md
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Add notes..."
      aria-label="Patient notes"
    />
  </div>
);
