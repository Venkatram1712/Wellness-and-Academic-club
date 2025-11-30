import { createSlice, nanoid } from '@reduxjs/toolkit';

const STORAGE_KEY = 'mental_tips_state_v1';

const loadTips = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to read mental tips from storage', error);
    return null;
  }
};

const saveTips = (tips) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ tips }));
  } catch (error) {
    console.warn('Failed to persist mental tips', error);
  }
};

const seedTips = [
  {
    id: nanoid(),
    text: 'Switch devices to grayscale after 10pm—your nervous system will wind down faster.',
    author: 'Campus Admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: nanoid(),
    text: 'Stack a 5-minute breath ladder before every study sprint to keep cortisol steady.',
    author: 'Wellness Desk',
    createdAt: new Date().toISOString(),
  },
];

const persisted = loadTips();

const initialState = {
  tips: persisted?.tips?.length ? persisted.tips : seedTips,
};

const mentalTipsSlice = createSlice({
  name: 'mentalTips',
  initialState,
  reducers: {
    addTip: {
      reducer(state, action) {
        state.tips.unshift(action.payload);
        saveTips(state.tips);
      },
      prepare({ text, author }) {
        return {
          payload: {
            id: nanoid(),
            text,
            author: author || 'Campus Admin',
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    deleteTip(state, action) {
      const idx = state.tips.findIndex((tip) => tip.id === action.payload);
      if (idx === -1) return;
      state.tips.splice(idx, 1);
      saveTips(state.tips);
    },
  },
});

export const { addTip, deleteTip } = mentalTipsSlice.actions;
export default mentalTipsSlice.reducer;
