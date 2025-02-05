import { useState } from "react";
import { FilterCriteria } from "../../utils/filterUtils";
import { styles } from "../../styles";

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
  const [recentUpdateWindow, setRecentUpdateWindow] = useState<
    "5min" | "15min" | "1hour"
  >("1hour");

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
      recentUpdateWindow,
    });

    onClose();
  };

  return (
    <div className={styles.filter.panel.container}>
      <div className={styles.filter.panel.header.wrapper}>
        <h3 className={styles.filter.panel.header.title}>Filters</h3>
        <button
          onClick={onClose}
          className={styles.filter.panel.header.closeButton}
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

      <div className={styles.filter.panel.content}>
        <div className={styles.filter.panel.section.wrapper}>
          <label htmlFor="name" className={styles.filter.panel.section.label}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.filter.panel.section.input}
          />
        </div>

        <div className={styles.filter.panel.section.wrapper}>
          <label
            htmlFor="ageRangeMin"
            className={styles.filter.panel.section.label}
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
              className={styles.filter.panel.section.input}
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
              className={styles.filter.panel.section.input}
            />
          </div>
        </div>

        <div className={styles.filter.panel.section.wrapper}>
          <label htmlFor="gender" className={styles.filter.panel.section.label}>
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) =>
              setGender(e.target.value as "male" | "female" | "other")
            }
            className={styles.filter.panel.section.input}
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.filter.panel.section.wrapper}>
          <label htmlFor="room" className={styles.filter.panel.section.label}>
            Room
          </label>
          <input
            id="room"
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className={styles.filter.panel.section.input}
          />
        </div>

        <div className={styles.filter.panel.section.wrapper}>
          <label className={styles.filter.panel.section.label}>
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
                    className={styles.filter.panel.section.checkbox}
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
        <div className={styles.filter.panel.section.wrapper}>
          <label className={styles.filter.panel.section.label}>
            Recent Updates
          </label>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={recentUpdates}
                onChange={() => setRecentUpdates(!recentUpdates)}
                className={styles.filter.panel.section.checkbox}
              />
              <span className={styles.filter.panel.section.label}>
                Show Recent Updates
              </span>
            </label>
          </div>

          {recentUpdates && (
            <div className="mt-2 flex flex-col space-y-2">
              <select
                value={recentUpdateWindow}
                onChange={(e) =>
                  setRecentUpdateWindow(
                    e.target.value as "5min" | "15min" | "1hour"
                  )
                }
                className={styles.filter.panel.section.input}
              >
                <option value="5min">Last 5 minutes</option>
                <option value="15min">Last 15 minutes</option>
                <option value="1hour">Last hour</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleApplyFilters}
          className={styles.filter.panel.button}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
