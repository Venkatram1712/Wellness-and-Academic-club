import { createSlice } from '@reduxjs/toolkit';

// Initial state, loaded from Local Storage (Data Persistence)
const initialNews = JSON.parse(localStorage.getItem('newsArticles')) || [
  { id: 1, title: 'Campus Gym Reopening Schedule', content: 'New hours start Monday. Don\'t forget your ID!', date: '2025-10-20' },
  { id: 2, title: 'Free Mental Health Workshop', content: 'Sign up for our stress management seminar next week.', date: '2025-10-18' },
];

const newsSlice = createSlice({
  name: 'news',
  initialState: { articles: initialNews },
  reducers: {
    // Admin function: Update the entire news list
    updateNewsArticles: (state, action) => {
      state.articles = action.payload;
      // Persist to Local Storage
      localStorage.setItem('newsArticles', JSON.stringify(action.payload));
    },
    // Admin function: Add a new article
    addNewsArticle: (state, action) => {
      state.articles.unshift(action.payload);
      localStorage.setItem('newsArticles', JSON.stringify(state.articles));
    },
    // Admin function: Delete an article
    deleteNewsArticle: (state, action) => {
      state.articles = state.articles.filter(article => article.id !== action.payload);
      localStorage.setItem('newsArticles', JSON.stringify(state.articles));
    },
  },
});

export const { updateNewsArticles, addNewsArticle, deleteNewsArticle } = newsSlice.actions;

export default newsSlice.reducer;