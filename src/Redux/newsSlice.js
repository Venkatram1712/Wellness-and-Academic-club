import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'whub:news-articles';

const FALLBACK_ARTICLES = [
  {
    id: 1,
    category: 'Technology',
    title: 'The Future of AI Technology in 2025',
    description: 'Exploring the latest advancements in artificial intelligence and machine learning that are shaping our future.',
    readTime: '5 min read',
    views: 12450,
    date: 'Nov 28, 2025',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1640&q=80',
  },
  {
    id: 2,
    category: 'Health',
    title: 'Complete Guide to Wellness and Mental Health',
    description: 'Discover essential tips for maintaining your mental and physical wellness in the middle of a busy semester.',
    readTime: '7 min read',
    views: 9870,
    date: 'Nov 27, 2025',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1640&q=80',
  },
  {
    id: 3,
    category: 'Business',
    title: 'Modern Business Strategies for Success',
    description: 'Learn the key strategies that successful businesses are implementing in today\'s fast-paced markets.',
    readTime: '4 min read',
    views: 8920,
    date: 'Nov 26, 2025',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1640&q=80',
  },
];

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStoredArticles = () => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw) : null;
};

const persistArticles = (articles) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // ignore quota errors silently
  }
};

const initialState = {
  articles: getStoredArticles() || FALLBACK_ARTICLES,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
      persistArticles(state.articles);
    },
    addNewsArticle: (state, action) => {
      state.articles = [action.payload, ...state.articles];
      persistArticles(state.articles);
    },
    updateNewsArticle: (state, action) => {
      const updated = action.payload;
      const index = state.articles.findIndex((article) => article.id === updated.id);
      if (index !== -1) {
        state.articles[index] = updated;
        persistArticles(state.articles);
      }
    },
    deleteNewsArticle: (state, action) => {
      state.articles = state.articles.filter((a) => a.id !== action.payload);
      persistArticles(state.articles);
    },
    clearArticles: (state) => {
      state.articles = [];
      persistArticles(state.articles);
    },
  },
});

export const { setArticles, addNewsArticle, updateNewsArticle, deleteNewsArticle, clearArticles } = newsSlice.actions;
export default newsSlice.reducer;
