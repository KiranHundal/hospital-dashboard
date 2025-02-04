import React, { useState, useEffect } from "react";
import { Save, Clock } from "lucide-react";
import { Patient } from "../../../types/patient";

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">Comparison Notes</h3>

      <div className="flex gap-2 mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add observation note..."
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600
                   dark:text-white resize-none"
          rows={2}
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Save size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded border
                     border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <Clock size={14} />
              <span>{formatTime(note.timestamp)}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200">{note.text}</p>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No comparison notes yet
        </p>
      )}
    </div>
  );
};

export default ComparisonNotes;
