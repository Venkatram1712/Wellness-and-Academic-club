## Project Snapshot
- React 19 + Vite + MUI 7/Emotion; entry `src/main.jsx` wires Redux Toolkit store, custom theme, `components/ErrorBoundary.jsx`, and renders `App.jsx`.
- Routing lives in `src/App.jsx` (`react-router-dom@7`) with a `PrivateRoute` helper that checks `state.user` for `isAuthenticated` + `role`.
- Redux store currently mounts `user` and `news` reducers; other files under `src/Redux/` are legacy until they are added to `configureStore`.

## Build & Dev Workflow
- Install deps via `npm install`.
- Dev server: `npm run dev` (Vite proxies `/api` to `http://localhost:5000` per `vite.config.js`).
- Production: `npm run build` then `npm run preview` to verify output.
- Lint everything with `npm run lint`; there are no automated tests yet.

## Architecture & Data Flow
- `src/hooks/useAuth.js` tries `api.post('/api/login')` first, then falls back to mock `student/student` or `admin/admin` credentials and dispatches `setCredentials` before navigating based on role.
- `src/Redux/userSlice.js` normalizes display names and persists `{ user, role, token }` to `localStorage` key `wellnessUser`; keep that shape so `useAuth` and the axios interceptor keep working.
- `src/lib/api.js` is the axios singleton; always use it for `/api/*` calls so the Authorization header (sourced from `wellnessUser`) and Vite proxy remain consistent.
- `App.jsx` holds all public + protected routes; wrap new protected screens with `<PrivateRoute allowedRoles={[...]}>` to reuse the gating logic.
- `components/Ui/Header.jsx` controls the global chrome. Its view pills update `?view=` and dispatch `newshub:set-view`, which `src/pages/StudentDashboard.jsx` listens for—update both sides together.
- `StudentDashboard` renders a news feed sourced from `state.news.articles` (with fallbacks) and a metrics dashboard that keeps sleep/water values in component state.
- `src/Redux/newsSlice.js` is the canonical news slice (localStorage key `whub:news-articles`) and powers both the student feed and admin CRUD. The similarly named `newSlice.js` is a leftover and currently unused.
- `src/pages/AdminDashboard.jsx` dispatches `newsSlice` actions and calls `/api/issues`; it caches issue data via `src/lib/issuesStore.js` (`wellnessLocalIssues`) so reports submitted from `Community.jsx` remain visible offline.
- `src/lib/wellnessStorage.js` persists BMI + journaling data under `wellness:lastBmi` / `wellness:lastJournalEntry` per user (id/email/username). Reuse these helpers when adding new wellness widgets.
- `components/ErrorBoundary.jsx` wraps everything in `main.jsx` so unexpected runtime errors surface without blanking the whole SPA.

## Conventions & Gotchas
- `src/pages/` hosts screens, `src/components/` holds reusable widgets, and `src/components/Ui/` contains layout chrome; stick to `.jsx` files and MUI `sx` styling.
- When introducing Redux state, export the reducer from `src/Redux/<feature>Slice.js` and register it inside `configureStore` in `main.jsx` before calling `useSelector`.
- `HydrationTracker.jsx` is the maintained component; `HydrationTraker.jsx` is an outdated duplicate missing imports.
- `Register.jsx` is the routed registration view; `Registration.jsx` is a mock and should stay untouched unless you explicitly wire it into `App.jsx`.
- Keep `wellnessUser`, `whub:news-articles`, `wellnessLocalIssues`, `wellness:lastBmi`, and `wellness:lastJournalEntry` keys stable, otherwise `useAuth`, `newsSlice`, and the wellness tools will silently break.
- Prefer `api` over ad-hoc `fetch` so Authorization headers/tokens stay centralized (admin token copy, issue submission, etc.).

## Practical Snippets
- Protect a route: `<Route path="/fitness" element={<PrivateRoute allowedRoles={['student']}><Fitness /></PrivateRoute>} />`
- Add a reducer: `const store = configureStore({ reducer: { user: userReducer, news: newsReducer, reminders: remindersReducer } });`
- Auth-aware API call: `const res = await api.get('/api/issues'); // token auto-attached`

If any section feels unclear (e.g., wiring a real backend, onboarding new slices, or adding tests) let me know and I’ll expand this file.
