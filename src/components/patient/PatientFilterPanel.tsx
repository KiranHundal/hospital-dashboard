import { useState } from "react";
import { FilterCriteria } from "../../utils/filterUtils";

interface PatientFilterPanelProps {
  onClose: () => void;
  onFilterChange: (criteria: FilterCriteria) => void;
}

export const PatientFilterPanel = ({
  onClose,
  onFilterChange,
}: PatientFilterPanelProps) => {
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState<
    [number | undefined, number | undefined]
  >([undefined, undefined]);
  const [gender, setGender] = useState<
    "male" | "female" | "other" | undefined
  >();
  const [room, setRoom] = useState("");
  const [criticalVitals, setCriticalVitals] = useState({
    highBP: false,
    lowOxygen: false,
    abnormalHeartRate: false,
  });
  const [recentUpdates, setRecentUpdates] = useState(false);

  const handleApplyFilters = () => {
    const formattedAgeRange = ageRange.every((val) => val !== undefined)
      ? (ageRange as [number, number])
      : undefined;

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
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 p-6 transition-transform transform translate-x-0 border-l">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="ageRangeMin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Age Range
          </label>
          <div className="flex space-x-2">
            <input
              id="ageRangeMin"
              type="number"
              placeholder="Min"
              onChange={(e) =>
                setAgeRange((prev) => [
                  parseInt(e.target.value) || undefined,
                  prev[1],
                ])
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              onChange={(e) =>
                setAgeRange((prev) => [
                  prev[0],
                  parseInt(e.target.value) || undefined,
                ])
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) =>
              setGender(e.target.value as "male" | "female" | "other")
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="room"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Room
          </label>
          <input
            id="room"
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Critical Vitals
          </label>
          <div className="space-y-2">
            {["High Blood Pressure", "Low Oxygen", "Abnormal Heart Rate"].map(
              (label, index) => (
                <div key={label} className="flex items-center space-x-2">
                  <input
                    id={`critical-vital-${index}`}
                    type="checkbox"
                    checked={Object.values(criticalVitals)[index]}
                    onChange={() =>
                      setCriticalVitals((prev) => ({
                        ...prev,
                        [Object.keys(criticalVitals)[index]]:
                          !Object.values(criticalVitals)[index],
                      }))
                    }
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`critical-vital-${index}`}
                    className="text-gray-700"
                  >
                    {label}
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={recentUpdates}
              onChange={() => setRecentUpdates(!recentUpdates)}
              className="rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">Recent Updates</span>
          </label>
        </div>

        <button
          onClick={handleApplyFilters}
          className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
