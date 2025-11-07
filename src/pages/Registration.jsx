import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user types
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = "Username is required.";
    if (!formData.email) tempErrors.email = "Email is required.";
    if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // **API Integration Point:** In a real app, send data to the backend API here.
      // Mock registration success:
      console.log('Registration Data:', formData);
      alert("Registration successful! Please log in.");
      
      // Redirect to login page after successful mock registration
      navigate('/login'); 
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Sign Up for Wellness Hub
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal" required fullWidth autoFocus
            label="Username" name="username"
            value={formData.username} onChange={handleChange}
            error={!!errors.username} helperText={errors.username}
          />
          <TextField
            margin="normal" required fullWidth
            label="Email Address" name="email" type="email"
            value={formData.email} onChange={handleChange}
            error={!!errors.email} helperText={errors.email}
          />
          <TextField
            margin="normal" required fullWidth
            label="Password (min 6 chars)" name="password" type="password"
            value={formData.password} onChange={handleChange}
            error={!!errors.password} helperText={errors.password}
          />
          <TextField
            margin="normal" required fullWidth
            label="Confirm Password" name="confirmPassword" type="password"
            value={formData.confirmPassword} onChange={handleChange}
            error={!!errors.confirmPassword} helperText={errors.confirmPassword}
          />
          <Button
            type="submit" fullWidth variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#2ecc71', '&:hover': { bgcolor: '#27ae60' } }}
          >
            Register
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component="button" variant="body2" onClick={() => navigate('/login')}>
              Already have an account? Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Registration;