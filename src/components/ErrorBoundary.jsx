import React from 'react';
import { Container, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console — Vite will show this in the terminal
    console.error('Unhandled error in React component tree:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ mt: 8, p: 3 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Something went wrong rendering the app
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, whiteSpace: 'pre-wrap' }}>
            {this.state.info && this.state.info.componentStack}
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
