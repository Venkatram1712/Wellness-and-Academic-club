const BMI_KEY = 'wellness:lastBmi';
const JOURNAL_KEY = 'wellness:lastJournalEntry';

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const safeParse = (text, fallback = null) => {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
};

const emit = (eventName, detail) => {
  if (typeof window === 'undefined' || typeof CustomEvent === 'undefined') return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

const keyWithUser = (base, userKey) => (userKey ? `${base}:${userKey}` : base);

export const loadBmiResult = (userKey) => {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(keyWithUser(BMI_KEY, userKey));
  return raw ? safeParse(raw, null) : null;
};

export const saveBmiResult = ({ value, status }, userKey) => {
  if (!isBrowser()) return null;
  const payload = { value, status, updatedAt: new Date().toISOString() };
  localStorage.setItem(keyWithUser(BMI_KEY, userKey), JSON.stringify(payload));
  emit('wellness:bmi-updated', { userKey, data: payload });
  return payload;
};

export const loadJournalEntry = (userKey) => {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(keyWithUser(JOURNAL_KEY, userKey));
  return raw ? safeParse(raw, null) : null;
};

export const saveJournalEntry = (text, userKey) => {
  if (!isBrowser()) return null;
  const payload = { text, updatedAt: new Date().toISOString() };
  localStorage.setItem(keyWithUser(JOURNAL_KEY, userKey), JSON.stringify(payload));
  emit('wellness:journal-updated', { userKey, data: payload });
  return payload;
};
