import React, { useMemo, useState } from "react";
import { formatDateTime } from "../utils/format";

// PUBLIC_INTERFACE
export default function NoteList({ notes, selectedId, onSelect }) {
  /** Sidebar list view with search */
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => (n.title || "").toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q));
  }, [notes, query]);

  return (
    <aside className="sidebar">
      <div className="sidebar__search">
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <ul className="note-list" role="list">
        {filtered.map((n) => (
          <li
            key={n.id}
            className={`note-list-item ${selectedId === n.id ? "active" : ""}`}
            onClick={() => onSelect(n.id)}
            title={n.title}
          >
            <div className="note-list-item__title">{n.title || "Untitled"}</div>
            <div className="note-list-item__meta">{formatDateTime(n.updatedAt || n.createdAt)}</div>
          </li>
        ))}
        {filtered.length === 0 && <li className="note-list-empty">No notes found</li>}
      </ul>
    </aside>
  );
}
