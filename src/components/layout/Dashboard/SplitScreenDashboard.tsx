import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  ArrowLeftRight,
  Lock,
  Unlock,
} from "lucide-react";
import { Patient } from "../../../types/patient";
import VitalsComparison from "../../patient/splitScreen/VitalsComparison";
import ComparisonNotes from "../../patient/splitScreen/ComparisonNotes";
import clsx from "clsx";
import { colorStyles, styles } from "../../../styles";

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
    <div className={styles.splitScreen.container.base}>
      <div className={styles.splitScreen.container.header}>
        <div className={styles.splitScreen.container.controlsWrapper}>
          <button
            onClick={() => setSplitView((prev) => !prev)}
            className={styles.splitScreen.button.control}
          >
            {isSplitView ? (
              <Minimize2 className={styles.splitScreen.button.icon.active} />
            ) : (
              <Maximize2 className={styles.splitScreen.button.icon.default} />
            )}
          </button>

          <select
            className={styles.splitScreen.select.control}
            value={splitRatio}
            onChange={(e) => setSplitRatio(Number(e.target.value))}
          >
            <option value={30}>30/70</option>
            <option value={50}>50/50</option>
            <option value={70}>70/30</option>
          </select>

          <button
            onClick={() => setSplitRatio(100 - splitRatio)}
            className={styles.splitScreen.button.control}
          >
            <ArrowLeftRight
              className={styles.splitScreen.button.icon.default}
            />
          </button>

          <button
            onClick={() => setSyncScroll((prev) => !prev)}
            className={styles.splitScreen.button.control}
            title={`${
              isSyncScroll ? "Disable" : "Enable"
            } synchronized scrolling`}
          >
            {isSyncScroll ? (
              <Lock className={styles.splitScreen.button.icon.active} />
            ) : (
              <Unlock className={styles.splitScreen.button.icon.default} />
            )}
          </button>
        </div>
      </div>

      <div className={styles.splitScreen.container.contentWrapper}>
        <div
          ref={leftPanelRef}
          className={clsx(
            styles.splitScreen.container.panel.base,
            styles.splitScreen.container.panel.left
          )}
          style={{ width: `${splitRatio}%` }}
        >
          <div className={styles.splitScreen.container.panel.content}>
            <select
              className={styles.splitScreen.select.base}
              value={selectedPatients[0]?.id || ""}
              onChange={(e) => handleSelectPatient(0, e.target.value)}
            >
              <option value="">Select Left Patient</option>
              {patientOptions}
            </select>

            {selectedPatients[0] && (
              <div className={styles.splitScreen.text.content}>
                <h2 className={styles.splitScreen.text.title}>
                  {selectedPatients[0].name}
                </h2>
                <p className={colorStyles.text.muted}>
                  Room: {selectedPatients[0].room}
                </p>
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
          className={clsx(
            styles.splitScreen.container.panel.base,
            styles.splitScreen.container.panel.right
          )}
          style={{ width: `${100 - splitRatio}%` }}
        >
          <div className={styles.splitScreen.container.panel.content}>
            <select
              className={styles.splitScreen.select.base}
              value={selectedPatients[1]?.id || ""}
              onChange={(e) => handleSelectPatient(1, e.target.value)}
            >
              <option value="" className={styles.splitScreen.select.option}>
                Select Right Patient
              </option>
              {patientOptions}
            </select>

            {selectedPatients[1] && (
              <div className={styles.splitScreen.text.content}>
                <h2 className={styles.splitScreen.text.title}>
                  {selectedPatients[1].name}
                </h2>
                <p className={colorStyles.text.muted}>
                  Room: {selectedPatients[1].room}
                </p>
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
        <div className={styles.splitScreen.container.notesSection}>
          <div className={styles.splitScreen.container.notesContent}>
            <h3 className={styles.splitScreen.text.heading}>
              Comparison Notes
            </h3>

            <ComparisonNotes patients={selectedPatients} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitScreenDashboard;
