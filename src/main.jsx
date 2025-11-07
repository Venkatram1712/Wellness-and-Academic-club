import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
// src/main.jsx - UPDATE REDUX STORE CONFIG
import userReducer from './Redux/userSlice';
import newsReducer from './Redux/newsSlice'; // NEW IMPORT

// ... (inside configureStore)
const store = configureStore({
  reducer: {
    user: userReducer,
    news: newsReducer, // REGISTER NEW REDUCER
    // Add other state reducers here (e.g., resources, trackers)
  },
});

// Define a custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#c0392b', // Deep Red
    },
    secondary: {
      main: '#2c3e50', // Dark Text/Accent
    },
    background: {
      default: '#f8f8f8', // Off-white/Light Gray background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: 'white',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);