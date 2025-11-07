## Project snapshot

- This is a React 19 + Vite app (ESM). Entry points: `src/main.jsx` and `src/App.jsx`.
- UI uses Material-UI (MUI) with Emotion. State uses Redux Toolkit (`src/Redux/userSlice.js`).
- Routing is in `src/App.jsx` (react-router v7 style). Authentication is mocked in `src/hooks/useAuth.js` and persisted to localStorage under the key `wellnessUser`.

## Quick dev commands (from `package.json`)
- Install: `npm install`
- Dev server (HMR): `npm run dev` (runs `vite`).
- Build: `npm run build` (runs `vite build`).
- Lint: `npm run lint` (runs `eslint .`).

## High-level architecture & important patterns

- Routing & authorization: `src/App.jsx` defines routes and a small `PrivateRoute` wrapper that checks `state.user` (Redux) for `isAuthenticated` and `role`. Protected routes use `allowedRoles` arrays: e.g. `<PrivateRoute allowedRoles={["student"]}>`.
- Mock auth flow: `src/hooks/useAuth.js` implements `login` and `logout` for local development. Valid mock credentials: `student/student` (navigates to `/dashboard`) and `admin/admin` (navigates to `/admin`). The hook dispatches `setCredentials` which writes to localStorage.
- State persistence: `src/Redux/userSlice.js` reads/writes a single localStorage entry `wellnessUser` on set/logout. Keep that key and the payload shape `{ user, role }` consistent when modifying auth logic.
- Store setup: configured in `src/main.jsx` using `configureStore` from Redux Toolkit. To add a reducer, add it to the `reducer` object there (example comment present in the file).
- Theme: A single MUI theme is defined in `src/main.jsx`. Edit colors / component overrides there to affect the whole app.

## Codebase conventions and notes for changes

- File locations: UI components live under `src/components/Ui/` (note lowercase `ui`) and pages under `src/pages/`.
- Slices follow Redux Toolkit `createSlice` with exported actions; reducers are default exports (see `userSlice.js`).
- Use of `.jsx` for React files is common (both `.jsx` and `.js` appear). Keep consistent extensions when adding new files.
- Do not assume a backend exists: network calls are not present; `axios` is in dependencies but unused for auth. If adding real API integration, migrate mock login to an async API call and preserve the `setCredentials` payload shape or update all reads/writes to localStorage accordingly.

## Examples (copy/paste patterns)

- Protect a route (follow `App.jsx`):

  <PrivateRoute allowedRoles={["student", "admin"]}>
    <Community />
  </PrivateRoute>

- Add a new reducer to store (`src/main.jsx`):

  const store = configureStore({
    reducer: { user: userReducer, yourSlice: yourReducer }
  });

- Check auth in a component (use existing hook):

  import useAuth from './hooks/useAuth';
  const { isAuthenticated, user, role, login, logout } = useAuth();

## Integration points & dependencies

- MUI + Emotion: see `@mui/material`, `@emotion/react`, `@emotion/styled` in `package.json`.
- Redux Toolkit + React-Redux: `@reduxjs/toolkit`, `react-redux`. Patterns use `configureStore` and `createSlice`.
- Router: `react-router-dom` v7 — routing uses `<Routes>` and `element` props.

## What an AI agent should do/avoid

- Do: Prefer small, local edits that follow existing patterns (add new slice via `createSlice`, update `configureStore`, protect routes using `PrivateRoute`). Reference `src/hooks/useAuth.js` for login behavior.
- Do: Preserve localStorage key `wellnessUser` and payload shape unless performing a coordinated change across auth, localStorage reads, and navigation.
- Avoid: Introducing new global state without adding it to `configureStore` and the Provider in `src/main.jsx`.
- Avoid: Changing routing conventions; follow `App.jsx`'s `PrivateRoute` pattern and `allowedRoles` arrays for role checks.

## Where to look for more context

- `src/App.jsx` — routing, PrivateRoute, role-based access.
- `src/main.jsx` — store, theme, app bootstrap.
- `src/hooks/useAuth.js` — mocked login/logout, navigation behavior.
- `src/Redux/userSlice.js` — persisted user state and localStorage shape.

If anything here is unclear or you'd like more detail (for example, preferred test runner, CI steps, or how to wire a backend auth service), tell me which area to expand and I will update this file.
