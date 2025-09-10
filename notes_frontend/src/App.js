import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./index.css";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import { useNotes } from "./hooks/useNotes";

// PUBLIC_INTERFACE
function App() {
  /** Main application component orchestrating state and UI */
  const [theme, setTheme] = useState("light");
  const { notes, loading, error, setError, addNote, editNote, removeNote } = useNotes();
  const [selectedId, setSelectedId] = useState(null);

  const selectedNote = useMemo(() => notes.find((n) => n.id === selectedId) || null, [notes, selectedId]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // When notes load the first time, select the first one if none selected
  useEffect(() => {
    if (!selectedId && notes.length > 0) {
      setSelectedId(notes[0].id);
    } else if (selectedId && !notes.some((n) => n.id === selectedId)) {
      // Selected note was deleted
      setSelectedId(notes[0]?.id || null);
    }
  }, [notes, selectedId]);

  const handleNewNote = async () => {
    try {
      const created = await addNote("Untitled", "");
      setSelectedId(created.id);
    } catch {
      // error already managed in hook
    }
  };

  const handleSaveNote = async (changes) => {
    if (!selectedNote) return;
    try {
      await editNote(selectedNote.id, changes);
    } catch {
      // handled
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    const confirmDelete = window.confirm("Delete this note? This action cannot be undone.");
    if (!confirmDelete) return;
    try {
      await removeNote(selectedNote.id);
      // selection will auto-adjust via effect
    } catch {
      // handled
    }
  };

  return (
    <div className="App">
      <Navbar onAdd={handleNewNote} onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))} theme={theme} />

      {error && (
        <div className="alert" role="alert" onClick={() => setError("")} title="Click to dismiss">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading notes…</div>
      ) : (
        <Layout
          sidebar={<NoteList notes={notes} selectedId={selectedId} onSelect={setSelectedId} />}
          main={<NoteEditor note={selectedNote} onSave={handleSaveNote} onDelete={handleDeleteNote} />}
        />
      )}

      <footer className="footer">
        <span>Notes are currently stored locally until backend is connected.</span>
        <span className="dot">•</span>
        <span>Set REACT_APP_API_BASE_URL to integrate with notes_database.</span>
      </footer>
    </div>
  );
}

export default App;
