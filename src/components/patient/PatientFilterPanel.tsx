import { useState } from 'react';
import { FilterCriteria } from '../../utils/filterUtils';

interface PatientFilterPanelProps {
  onClose: () => void;
  onFilterChange: (criteria: FilterCriteria) => void;
}

export const PatientFilterPanel = ({
  onClose,
  onFilterChange,
}: PatientFilterPanelProps) => {
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState<[number | undefined, number | undefined]>([
    undefined,
    undefined,
  ]);
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>();
  const [room, setRoom] = useState('');
  const [criticalVitals, setCriticalVitals] = useState({
    highBP: false,
    lowOxygen: false,
    abnormalHeartRate: false,
  });
  const [recentUpdates, setRecentUpdates] = useState(false);

  const handleApplyFilters = () => {
    const formattedAgeRange =
      ageRange.every((val) => val !== undefined) ? (ageRange as [number, number]) : undefined;

    onFilterChange({
      name,
      ageRange: formattedAgeRange,
      gender,
      room,
      criticalVitals,
      recentUpdates,
    });

    onClose();
  };

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-6 transition-transform transform translate-x-0">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Age Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              onChange={(e) =>
                setAgeRange((prev) => [parseInt(e.target.value) || undefined, prev[1]])
              }
              className="w-full border rounded p-2"
            />
            <input
              type="number"
              placeholder="Max"
              onChange={(e) =>
                setAgeRange((prev) => [prev[0], parseInt(e.target.value) || undefined])
              }
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
            className="w-full border rounded p-2"
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Room</label>
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Critical Vitals</label>
          <div>
            <input
              type="checkbox"
              checked={criticalVitals.highBP}
              onChange={() =>
                setCriticalVitals((prev) => ({ ...prev, highBP: !prev.highBP }))
              }
            />
            <span className="ml-2">High Blood Pressure</span>
          </div>
          <div>
            <input
              type="checkbox"
              checked={criticalVitals.lowOxygen}
              onChange={() =>
                setCriticalVitals((prev) => ({ ...prev, lowOxygen: !prev.lowOxygen }))
              }
            />
            <span className="ml-2">Low Oxygen</span>
          </div>
          <div>
            <input
              type="checkbox"
              checked={criticalVitals.abnormalHeartRate}
              onChange={() =>
                setCriticalVitals((prev) => ({
                  ...prev,
                  abnormalHeartRate: !prev.abnormalHeartRate,
                }))
              }
            />
            <span className="ml-2">Abnormal Heart Rate</span>
          </div>
        </div>
        <div>
          <input
            type="checkbox"
            checked={recentUpdates}
            onChange={() => setRecentUpdates(!recentUpdates)}
          />
          <span className="ml-2">Recent Updates</span>
        </div>
        <button
          onClick={handleApplyFilters}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
