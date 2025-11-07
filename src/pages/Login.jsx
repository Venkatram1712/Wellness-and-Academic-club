// src/pages/Login.jsx (Add Link import and logic)
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // call mocked login from the hook which handles navigation
    await login(username.trim(), password.trim());
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Welcome — Sign in
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
            Sign In
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Link component="button" variant="body2" onClick={() => navigate('/register')}>
              Don't have an account? Sign Up
            </Link>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            *Use 'student'/'student' or 'admin'/'admin' to test.*
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;