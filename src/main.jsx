import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
// src/main.jsx - UPDATE REDUX STORE CONFIG
import userReducer from './Redux/userSlice';
import newsReducer from './Redux/newsSlice';
import trainerReducer from './Redux/trainerSlice';
import communityReducer from './Redux/communitySlice';
import mentalTipsReducer from './Redux/mentalTipsSlice';
import issuesReducer from './Redux/issuesSlice';

// ... (inside configureStore)
const store = configureStore({
  reducer: {
    user: userReducer,
    news: newsReducer,
    trainers: trainerReducer,
    community: communityReducer,
    mentalTips: mentalTipsReducer,
    issues: issuesReducer,
    // Add other state reducers here (e.g., resources, trackers)
  },
});

// Define a custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#0f172a',
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff',
    },
    success: {
      main: '#0f9d58',
    },
    error: {
      main: '#d93025',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f4f6fb',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 28,
          border: '1px solid rgba(15,23,42,0.06)',
          boxShadow: '0 20px 60px rgba(15,23,42,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          border: '1px solid rgba(15,23,42,0.06)',
          boxShadow: '0 24px 55px rgba(15,23,42,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
          paddingInline: '1.5rem',
        },
        containedPrimary: {
          color: '#fff',
          boxShadow: '0 12px 24px rgba(26,115,232,0.3)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 18,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
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