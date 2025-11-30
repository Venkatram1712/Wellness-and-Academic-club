const STORAGE_KEY = 'community_state_v1';

export const loadCommunityState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to load community state from storage', error);
    return null;
  }
};

export const saveCommunityState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist community state', error);
  }
};
