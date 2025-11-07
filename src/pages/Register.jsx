import React, { useState } from 'react';
import { Container, Paper, Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Admin' },
];

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleRegister = async (e) => {
    e.preventDefault();
    const uname = username.trim();
    const pwd = password.trim();
    const mail = email.trim();
    if (!uname || !pwd) return alert('Username and password are required');
    if (uname.length < 3) return alert('Username must be at least 3 characters');
    if (pwd.length < 4) return alert('Password must be at least 4 characters');
    try {
      await api.post('/api/register', { username: uname, email: mail, password: pwd, role: String(role).toLowerCase() });
      alert('Registered successfully. You can now log in.');
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      alert(`Registration failed: ${msg}`);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Create an account</Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField label="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <TextField select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map((r) => (
              <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained">Register</Button>
          <Button variant="text" onClick={() => navigate('/login')}>Back to login</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
