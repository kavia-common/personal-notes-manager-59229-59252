import { useCallback, useEffect, useMemo, useState } from "react";
import { listNotes, createNote, updateNote, deleteNote } from "../services/api";

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Hook to manage the list of notes with CRUD operations.
   * It abstracts the API interactions and exposes simple handlers to the UI.
   */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listNotes();
      // Ensure consistent sorting: latest updated first
      data.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      setNotes(data);
    } catch (e) {
      setError(e?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addNote = useCallback(async (title = "Untitled", content = "") => {
    setError("");
    try {
      const created = await createNote({ title, content });
      setNotes((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      setError(e?.message || "Failed to create note");
      throw e;
    }
  }, []);

  const editNote = useCallback(async (id, changes) => {
    setError("");
    try {
      const updated = await updateNote(id, changes);
      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === id);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = updated;
        // re-sort after update
        next.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        return next;
      });
      return updated;
    } catch (e) {
      setError(e?.message || "Failed to update note");
      throw e;
    }
  }, []);

  const removeNote = useCallback(async (id) => {
    setError("");
    // Optimistic removal
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNote(id);
    } catch (e) {
      // On failure, request a reload to reconcile
      load();
      setError(e?.message || "Failed to delete note");
      throw e;
    }
  }, [load]);

  const stats = useMemo(
    () => ({
      count: notes.length,
    }),
    [notes]
  );

  return {
    notes,
    loading,
    error,
    stats,
    reload: load,
    addNote,
    editNote,
    removeNote,
    setError, // expose for clearing in UI
  };
}
