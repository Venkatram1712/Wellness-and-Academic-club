import { createSlice, nanoid } from '@reduxjs/toolkit';
import { readIssues, upsertIssues } from '../lib/issuesStore';

const persistIssues = (issues) => {
  try {
    upsertIssues(issues);
  } catch (error) {
    console.warn('Failed to persist issues locally', error);
  }
};

const initialState = {
  items: readIssues(),
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    addIssue: {
      reducer(state, action) {
        state.items.unshift(action.payload);
        persistIssues(state.items);
      },
      prepare(issue) {
        const timestamp = new Date().toISOString();
        return {
          payload: {
            id: issue?.id ?? nanoid(),
            title: issue?.title || 'Untitled issue',
            details: issue?.details || 'No details provided',
            status: issue?.status || 'submitted',
            created_at: issue?.created_at || timestamp,
            username: issue?.username || 'anonymous',
          },
        };
      },
    },
    replaceIssues(state, action) {
      state.items = action.payload || [];
      persistIssues(state.items);
    },
  },
});

export const { addIssue, replaceIssues } = issuesSlice.actions;
export default issuesSlice.reducer;
