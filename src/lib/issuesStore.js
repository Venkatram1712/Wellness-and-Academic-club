const STORAGE_KEY = 'wellnessLocalIssues';

const safeParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const readIssues = () => {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw) : [];
};

export const writeIssues = (issues) => {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
};

export const storeIssue = (issue) => {
  const current = readIssues();
  const next = [issue, ...current];
  writeIssues(next);
  return next;
};

export const upsertIssues = (issues = []) => {
  if (!Array.isArray(issues)) return readIssues();
  writeIssues(issues);
  return issues;
};
