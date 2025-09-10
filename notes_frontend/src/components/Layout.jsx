import React from "react";

// PUBLIC_INTERFACE
export default function Layout({ sidebar, main }) {
  /** Two-column responsive layout container */
  return (
    <div className="layout">
      <div className="layout__sidebar">{sidebar}</div>
      <div className="layout__main">{main}</div>
    </div>
  );
}
