import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'wellness:trainerWorkouts';

const DEFAULT_TRAINERS = [
  {
    id: 1,
    name: 'Sadhguru Wellness Team',
    specialty: 'Yoga & Breath Reset',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    youtubeLink: 'https://www.youtube.com/watch?v=EwQkfoKxRvo',
  },
  {
    id: 2,
    name: 'Caroline Jordan',
    specialty: 'Stress Relief Workouts',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    youtubeLink: 'https://www.youtube.com/watch?v=ah4PAK18Rtg',
  },
];

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const loadFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw) : null;
};

const persistToStorage = (items) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // silent
  }
};

const initialState = {
  items: loadFromStorage() || DEFAULT_TRAINERS,
};

const trainerSlice = createSlice({
  name: 'trainers',
  initialState,
  reducers: {
    setTrainers: (state, action) => {
      state.items = action.payload;
      persistToStorage(state.items);
    },
    addTrainer: (state, action) => {
      state.items = [action.payload, ...state.items];
      persistToStorage(state.items);
    },
    updateTrainer: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((trainer) => (trainer.id === updated.id ? updated : trainer));
      persistToStorage(state.items);
    },
    deleteTrainer: (state, action) => {
      state.items = state.items.filter((trainer) => trainer.id !== action.payload);
      persistToStorage(state.items);
    },
  },
});

export const { setTrainers, addTrainer, updateTrainer, deleteTrainer } = trainerSlice.actions;
export default trainerSlice.reducer;
