import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  ArrowLeftRight,
  Lock,
  Unlock,
} from "lucide-react";
import { Patient } from "../../../types/patient";
import VitalsComparison from "../../patient/VitalsComparison";
import ComparisonNotes from "../../patient/ComparisonNotes";

interface SplitScreenDashboardProps {
  patients: Patient[];
}

const SplitScreenDashboard: React.FC<SplitScreenDashboardProps> = ({
  patients,
}) => {
  const [isSplitView, setSplitView] = useState<boolean>(true);
  const [selectedPatients, setSelectedPatients] = useState<
    [Patient | null, Patient | null]
  >([null, null]);
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [isSyncScroll, setSyncScroll] = useState(true);

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (!isSyncScroll) return;

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
  }, [isSyncScroll]);

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
    <div className="flex flex-col h-[calc(100vh-12rem)]">
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

          <select
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={splitRatio}
            onChange={(e) => setSplitRatio(Number(e.target.value))}
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
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          ref={leftPanelRef}
          className="overflow-y-auto transition-all duration-300 border-r dark:border-gray-700"
          style={{ width: `${splitRatio}%` }}
        >
          <div className="p-4">
            <select
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={selectedPatients[0]?.id || ""}
              onChange={(e) => handleSelectPatient(0, e.target.value)}
            >
              <option value="">Select Left Patient</option>
              {patientOptions}
            </select>

            {selectedPatients[0] && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  {selectedPatients[0].name}
                </h2>
                <p>Room: {selectedPatients[0].room}</p>
                <VitalsComparison
                  patient={selectedPatients[0]}
                  comparisonPatient={selectedPatients[1]}
                />
              </div>
            )}
          </div>
        </div>

        <div
          ref={rightPanelRef}
          className="overflow-y-auto transition-all duration-300"
          style={{ width: `${100 - splitRatio}%` }}
        >
          <div className="p-4">
            <select
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={selectedPatients[1]?.id || ""}
              onChange={(e) => handleSelectPatient(1, e.target.value)}
            >
              <option value="">Select Right Patient</option>
              {patientOptions}
            </select>

            {selectedPatients[1] && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  {selectedPatients[1].name}
                </h2>
                <p>Room: {selectedPatients[1].room}</p>
                <VitalsComparison
                  patient={selectedPatients[1]}
                  comparisonPatient={selectedPatients[0]}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPatients.some((p) => p) && (
        <div className="h-72 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="h-full overflow-y-auto p-4">
            <ComparisonNotes patients={selectedPatients} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitScreenDashboard;
