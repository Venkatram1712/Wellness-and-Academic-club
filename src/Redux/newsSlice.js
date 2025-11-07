import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articles: [],
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    // Replace articles in bulk
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    // Add a single article
    addNewsArticle: (state, action) => {
      state.articles.unshift(action.payload);
    },
    // Delete article by id
    deleteNewsArticle: (state, action) => {
      state.articles = state.articles.filter((a) => a.id !== action.payload);
    },
    clearArticles: (state) => {
      state.articles = [];
    },
  },
});

export const { setArticles, addNewsArticle, deleteNewsArticle, clearArticles } = newsSlice.actions;
export default newsSlice.reducer;
