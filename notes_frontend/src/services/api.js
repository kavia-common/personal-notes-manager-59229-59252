//
// Generic API interaction functions for the Notes app.
// These functions are designed to be backend-agnostic and easy to swap
// when integrating with the 'notes_database' backend later.
//
// IMPORTANT ENV NOTE:
// - Configure the base URL for the backend using REACT_APP_API_BASE_URL in .env.
// - Do NOT commit actual .env to source control. Provide variables via .env.example.
//
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // e.g., "http://localhost:8000"

// Helper to build full URL with path
const buildUrl = (path) => {
  // Ensure there's no double slash
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};

// Shared fetch wrapper with JSON handling and error normalization
async function request(path, options = {}) {
  const url = buildUrl(path);
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const fetchOptions = {
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
  };

  try {
    const res = await fetch(url, fetchOptions);
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
      const errPayload = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");
      const message =
        (isJson && errPayload && (errPayload.error || errPayload.message)) ||
        (typeof errPayload === "string" ? errPayload : "Request failed");
      const error = new Error(message);
      error.status = res.status;
      error.payload = errPayload;
      throw error;
    }

    return isJson ? res.json() : res.text();
  } catch (err) {
    // Network error or thrown above
    // eslint-disable-next-line no-console
    console.error("API request error:", err);
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** Fetch a list of notes.
   * Placeholder implementation:
   * - If no backend is configured (no REACT_APP_API_BASE_URL), read from localStorage.
   * - Once backend is available, this will call GET /notes.
   */
  if (!API_BASE_URL) {
    const raw = localStorage.getItem("notes_store_v1") || "[]";
    return JSON.parse(raw);
  }
  return request("/notes", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /** Create a new note.
   * Expected input: { title: string, content: string }
   * Placeholder implementation uses localStorage if no backend is configured.
   * Backend target: POST /notes with JSON body, returns created note { id, title, content, updatedAt, createdAt }
   */
  if (!API_BASE_URL) {
    const raw = localStorage.getItem("notes_store_v1") || "[]";
    const data = JSON.parse(raw);
    const now = new Date().toISOString();
    const newNote = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      title: note.title?.trim() || "Untitled",
      content: note.content || "",
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newNote, ...data];
    localStorage.setItem("notes_store_v1", JSON.stringify(updated));
    return newNote;
  }
  return request("/notes", { method: "POST", body: JSON.stringify(note) });
}

// PUBLIC_INTERFACE
export async function updateNote(id, changes) {
  /** Update an existing note by id.
   * Expected input: (id: string, changes: { title?: string, content?: string })
   * Placeholder: localStorage update if no backend configured.
   * Backend target: PATCH /notes/:id
   */
  if (!API_BASE_URL) {
    const raw = localStorage.getItem("notes_store_v1") || "[]";
    const data = JSON.parse(raw);
    const idx = data.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Note not found");
    const now = new Date().toISOString();
    const updatedNote = { ...data[idx], ...changes, updatedAt: now };
    const updated = [...data];
    updated[idx] = updatedNote;
    localStorage.setItem("notes_store_v1", JSON.stringify(updated));
    return updatedNote;
  }
  return request(`/notes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id.
   * Placeholder: remove from localStorage if no backend is configured.
   * Backend target: DELETE /notes/:id
   */
  if (!API_BASE_URL) {
    const raw = localStorage.getItem("notes_store_v1") || "[]";
    const data = JSON.parse(raw);
    const updated = data.filter((n) => n.id !== id);
    localStorage.setItem("notes_store_v1", JSON.stringify(updated));
    return { success: true };
  }
  return request(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
}
