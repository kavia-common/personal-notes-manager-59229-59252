import React, { useEffect, useMemo, useState } from "react";
import { debounce, formatDateTime } from "../utils/format";

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onDelete }) {
  /**
   * Controlled editor for a single note.
   * - Auto-save content on pause (debounced)
   * - Manual save button for immediate commit
   */
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const canSave = useMemo(() => !!note && (title !== (note.title || "") || content !== (note.content || "")), [note, title, content]);

  // Sync local state when note changes
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]); // only when switching notes

  // Debounced auto-save
  const autoSave = useMemo(
    () =>
      debounce(() => {
        if (!note) return;
        if (canSave) {
          onSave({ title: title.trim() || "Untitled", content });
        }
      }, 500),
    // include values used inside to refresh debounced fn
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note?.id, title, content, canSave]
  );

  useEffect(() => {
    autoSave();
    // cancel on unmount by calling a no-op; debounce cleanup not required here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  if (!note) {
    return (
      <section className="editor empty">
        <div className="empty-state">
          <p>Select a note to view and edit, or create a new note.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="editor">
      <div className="editor__header">
        <input
          className="editor__title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          aria-label="Note title"
        />
        <div className="editor__actions">
          <button
            className="btn btn-primary"
            disabled={!canSave}
            onClick={() => onSave({ title: title.trim() || "Untitled", content })}
          >
            Save
          </button>
          <button className="btn btn-danger" onClick={onDelete} aria-label="Delete note">
            Delete
          </button>
        </div>
      </div>
      <div className="editor__meta">
        <span>Last updated: {formatDateTime(note.updatedAt || note.createdAt)}</span>
      </div>
      <textarea
        className="editor__content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note here..."
        aria-label="Note content"
      />
    </section>
  );
}
