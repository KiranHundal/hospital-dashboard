import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  ArrowLeftRight,
  Lock,
  Unlock,
} from "lucide-react";
import { Patient } from "../../types/patient";
import VitalsComparison from "../patient/VitalsComparison";
import ComparisonNotes from "../patient/ComparisonNotes";

interface SplitScreenDashboardProps {
  patients: Patient[];
}

const SplitScreenDashboard: React.FC<SplitScreenDashboardProps> = ({
  patients,
}) => {
  const [isSplitView, setSplitView] = useState<boolean>(false);

  const [selectedPatients, setSelectedPatients] = useState<
    [Patient | null, Patient | null]
  >([null, null]);
  const [splitRatio, setSplitRatio] = useState<number>(50);

  const [isSyncScroll, setSyncScroll] = useState(true);

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const isScrolling = useRef(false);

  useEffect(() => {
    if (!isSplitView || !isSyncScroll) return;

    const handleScroll = (e: Event) => {
      if (isScrolling.current) return;
      isScrolling.current = true;

      const source = e.target as HTMLDivElement;
      const target =
        source === leftPanelRef.current
          ? rightPanelRef.current
          : leftPanelRef.current;

      if (target) {
        target.scrollTop = source.scrollTop;
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 50);
    };

    leftPanelRef.current?.addEventListener("scroll", handleScroll);
    rightPanelRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      leftPanelRef.current?.removeEventListener("scroll", handleScroll);
      rightPanelRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [isSplitView, isSyncScroll]);
  const handleSelectPatient = (index: 0 | 1, id: string) => {
    const selectedPatient = patients.find((p) => p.id === id) || null;
    setSelectedPatients((prev) => {
      const updated = [...prev] as [Patient | null, Patient | null];
      updated[index] = selectedPatient;
      return updated;
    });
  };

  const patientOptions = useMemo(() => {
    return patients.map((patient) => (
      <option key={patient.id} value={patient.id}>
        {patient.name} - Room {patient.room}
      </option>
    ));
  }, [patients]);

  return (
    <div className="h-screen">
      <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSplitView((prev) => !prev)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isSplitView ? (
              <Minimize2 className="text-blue-500" />
            ) : (
              <Maximize2 className="text-gray-500" />
            )}
          </button>

          {isSplitView && (
            <>
              <select
                className="p-2 border rounded"
                value={splitRatio}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSplitRatio(Number(e.target.value))
                }
              >
                <option value={30}>30/70</option>
                <option value={50}>50/50</option>
                <option value={70}>70/30</option>
              </select>
              <button
                onClick={() => setSplitRatio(100 - splitRatio)}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeftRight className="text-gray-500" />
              </button>
              <button
                onClick={() => setSyncScroll((prev) => !prev)}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title={`${
                  isSyncScroll ? "Disable" : "Enable"
                } synchronized scrolling`}
              >
                {isSyncScroll ? (
                  <Lock className="text-blue-500" />
                ) : (
                  <Unlock className="text-gray-500" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        <div
          style={{ width: isSplitView ? `${splitRatio}%` : "100%" }}
          className="transition-all duration-300 border-r"
        >
          <div className="p-4">
            <label htmlFor="left-patient-select" className="sr-only">
              Select a patient for the left panel
            </label>
            <select
              id="left-patient-select"
              className="w-full p-2 border rounded"
              value={selectedPatients[0]?.id || ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleSelectPatient(0, e.target.value)
              }
            >
              <option value="">Select Patient</option>
              {patientOptions}
            </select>

            {selectedPatients[0] && (
              <div className="mt-4 space-y-4">
                <h2 className="text-xl font-bold">
                  {selectedPatients[0].name}
                </h2>
                <p>Room: {selectedPatients[0].room}</p>
                <VitalsComparison
                  patient={selectedPatients[0]}
                  comparisonPatient={isSplitView ? selectedPatients[1] : null}
                />
              </div>
            )}
          </div>
        </div>

        {isSplitView && (
          <div
            style={{ width: `${100 - splitRatio}%` }}
            className="transition-all duration-300"
          >
            <div className="p-4">
              <label htmlFor="right-patient-select" className="sr-only">
                Select a patient for the right panel
              </label>
              <select
                id="right-patient-select"
                className="w-full p-2 border rounded"
                value={selectedPatients[1]?.id || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleSelectPatient(1, e.target.value)
                }
              >
                <option value="">Select Patient</option>
                {patientOptions}
              </select>

              {isSplitView && selectedPatients[1] && (
                <div className="mt-4 space-y-4">
                  <h2 className="text-xl font-bold">
                    {selectedPatients[1].name}
                  </h2>
                  <p>Room: {selectedPatients[1].room}</p>
                  <VitalsComparison
                    patient={selectedPatients[1]}
                    comparisonPatient={selectedPatients[0]}
                  />{" "}
                </div>
              )}
            </div>
          </div>
        )}
        {isSplitView && selectedPatients.some((p) => p) && (
          <div
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t
               transform transition-transform duration-300"
            style={{ height: "30vh" }}
          >
            <div className="max-w-7xl mx-auto px-4 h-full overflow-y-auto">
              <ComparisonNotes patients={selectedPatients} />
            </div>
          </div>
        )}

        <div
          className="flex"
          style={{
            height:
              isSplitView && selectedPatients.some((p) => p)
                ? "calc(70vh - 4rem)"
                : "calc(100vh - 4rem)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SplitScreenDashboard;
