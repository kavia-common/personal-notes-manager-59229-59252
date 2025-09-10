import React from "react";

// PUBLIC_INTERFACE
export default function Navbar({ onAdd, onToggleTheme, theme }) {
  /** Simple top navigation bar for app controls */
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="logo">📝</span>
        <span className="brand-text">My Notes</span>
      </div>
      <div className="navbar__actions">
        <button className="btn btn-primary" onClick={onAdd} aria-label="Create a new note">
          + New Note
        </button>
        <button className="btn" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}
