# Notes Frontend (React)

A clean, lightweight React app for creating, editing, and managing personal notes. It uses functional components and a small set of utilities. The app currently stores notes in localStorage when no backend is configured and exposes a generic API client ready to integrate with the `notes_database` backend.

## Features

- Notes CRUD UI: list, search, create, edit (auto-save + manual save), delete
- Two-column responsive layout (sidebar list + main editor)
- Light/Dark theme toggle
- Graceful error handling and loading states
- Backend-agnostic API layer with local fallback (localStorage)
- Clear code structure with comments and placeholders for backend integration

## Quick Start

- Install dependencies: `npm install`
- Start dev server: `npm start`
- Optionally configure backend base URL:
  - Copy `.env.example` to `.env`
  - Set `REACT_APP_API_BASE_URL=http://localhost:8000` (or your API)
  - Restart dev server for changes to take effect

## Project Structure

- `src/services/api.js` — Generic CRUD functions (listNotes, createNote, updateNote, deleteNote).
  - If `REACT_APP_API_BASE_URL` is unset, the service uses `localStorage` for demo purposes.
  - Backend placeholders (expected endpoints once connected):
    - GET `/notes` — list notes
    - POST `/notes` — create note
    - PATCH `/notes/:id` — update note
    - DELETE `/notes/:id` — delete note
- `src/hooks/useNotes.js` — Encapsulates note state and CRUD handlers for UI.
- `src/components/` — UI components:
  - `Navbar.jsx` — top bar with New Note + Theme toggle
  - `Layout.jsx` — responsive two-column layout
  - `NoteList.jsx` — searchable note list
  - `NoteEditor.jsx` — title/content editor with auto-save and delete
- `src/utils/format.js` — date formatting and debounce helper.
- `src/App.js` — assembles the app.

## Styling

- Styles in `src/App.css` use CSS variables for theming.
- Light/dark mode via `[data-theme="dark"]`.
- Accessible controls with labels and clear focus/hover feedback.

## Testing

- The default CRA test setup is present. You can extend tests to cover hooks and components.

## Backend Integration Notes

- Configure `REACT_APP_API_BASE_URL` to switch from localStorage to real API calls.
- The `api.js` request helper uses `fetch` with JSON and normalizes errors.
- Add auth headers or custom logic in `request()` as needed for your environment.

## Scripts

- `npm start` — Development server
- `npm test` — Tests
- `npm run build` — Production build

## License

MIT
