import React, { useState, useEffect } from "react";
import { Save, Clock } from "lucide-react";
import { Patient } from "../../../types/patient";
import { buttonStyles, styles } from "../../../styles";
import clsx from "clsx";

interface ComparisonNote {
  id: string;
  text: string;
  timestamp: string;
  patientIds: string[];
}

interface ComparisonNotesProps {
  patients: [Patient | null, Patient | null];
}

const ComparisonNotes: React.FC<ComparisonNotesProps> = ({ patients }) => {
  const [notes, setNotes] = useState<ComparisonNote[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const patientIds = patients.map((p) => p?.id).filter(Boolean) as string[];
    if (patientIds.length === 0) return;

    const savedNotes = localStorage.getItem(
      `comparisonNotes-${patientIds.sort().join("-")}`
    );
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes([]);
    }
  }, [patients]);

  const saveNotes = (updatedNotes: ComparisonNote[]) => {
    const patientIds = patients.map((p) => p?.id).filter(Boolean) as string[];
    if (patientIds.length === 0) return;

    localStorage.setItem(
      `comparisonNotes-${patientIds.sort().join("-")}`,
      JSON.stringify(updatedNotes)
    );
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const patientIds = patients.map((p) => p?.id).filter(Boolean) as string[];
    if (patientIds.length === 0) return;

    const newNoteObj: ComparisonNote = {
      id: Date.now().toString(),
      text: newNote.trim(),
      timestamp: new Date().toISOString(),
      patientIds,
    };

    saveNotes([...notes, newNoteObj]);
    setNewNote("");
  };

  const handleDeleteNote = (noteId: string) => {
    saveNotes(notes.filter((note) => note.id !== noteId));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.comparison.container}>
      <div className="flex gap-2 mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add observation note..."
          className={styles.comparison.notes.input}
          rows={2}
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className={clsx(
            buttonStyles.search.base,
            buttonStyles.search.primary,
            buttonStyles.pagination.disabled
          )}
        >
          <Save size={20} />
        </button>
      </div>

      <div className={styles.comparison.notes.container}>
        {notes.map((note) => (
          <div key={note.id} className={styles.comparison.notes.item}>
            <div className={styles.comparison.notes.timestamp}>
              <Clock size={14} />
              <span>{formatTime(note.timestamp)}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200">{note.text}</p>
            <div className={styles.comparison.notes.actions}>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className={buttonStyles.patient.delete}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {notes.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No comparison notes yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ComparisonNotes;
