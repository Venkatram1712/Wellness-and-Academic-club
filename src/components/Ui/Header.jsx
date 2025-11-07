import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, createTheme, ThemeProvider } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const theme = createTheme({ palette: { primary: { main: '#c0392b' } } });

const Header = () => {
  const { isAuthenticated, logout, role } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', roles: ['student'] },
    { name: 'Fitness', path: '/fitness', roles: ['student'] },
    { name: 'Mental Health', path: '/mental-health', roles: ['student'] },
    { name: 'Community', path: '/community', roles: ['student', 'admin'] }, 
    { name: 'Admin Panel', path: '/admin', roles: ['admin'] },
  ];

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" aria-label="home" component={Link} to={isAuthenticated ? (role === 'admin' ? '/admin' : '/dashboard') : '/login'} sx={{ mr: 2 }}>
            <SpaIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            Wellness & Academic Hub
          </Typography>

          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                (item.roles.includes(role)) && (
                  <Button key={item.name} component={Link} to={item.path} sx={{ color: 'white', mx: 1 }}>
                    {item.name}
                  </Button>
                )
              ))}
            </Box>
          )}

          {isAuthenticated ? (
            <Button color="inherit" onClick={logout} variant="outlined" sx={{ ml: 2, borderColor: 'white' }}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login" variant="outlined" sx={{ ml: 2, borderColor: 'white' }}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;