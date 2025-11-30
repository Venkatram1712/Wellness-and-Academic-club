import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack, IconButton } from '@mui/material';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Fitness', path: '/fitness', roles: ['student'] },
    { name: 'Nutrition', path: '/nutrition', roles: ['student'] },
    { name: 'Mental Health', path: '/mental-health', roles: ['student'] },
    { name: 'Community', path: '/community', roles: ['student', 'admin'] },
    { name: 'Admin Panel', path: '/admin', roles: ['admin'] },
  ];

  const viewFromQuery = React.useMemo(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'dashboard' || view === 'feed') return view;
    return 'feed';
  }, [location.search]);

  const handleViewChange = (view) => {
    navigate({ pathname: '/dashboard', search: `?view=${view}` });
    window.dispatchEvent(new CustomEvent('newshub:set-view', { detail: view }));
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        color: '#0f172a',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <Toolbar sx={{ minHeight: 76, gap: 2 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          component={Link}
          to={isAuthenticated ? (role === 'admin' ? '/admin' : '/dashboard') : '/login'}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Box sx={{ bgcolor: '#e3f2fd', borderRadius: '16px', p: 1 }}>
            <ArticleRoundedIcon color="primary" />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Wellness & Academic Hub
          </Typography>
        </Stack>

        {role === 'student' && isAuthenticated && (
          <Stack direction="row" spacing={1} sx={{ bgcolor: '#f4f6fb', borderRadius: 999, p: 0.5 }}>
            {['feed', 'dashboard'].map((view) => (
              <Button
                key={view}
                size="small"
                onClick={() => handleViewChange(view)}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  fontWeight: 600,
                  bgcolor: viewFromQuery === view && location.pathname === '/dashboard' ? '#1a73e8' : 'transparent',
                  color: viewFromQuery === view && location.pathname === '/dashboard' ? '#fff' : '#0f172a',
                  '&:hover': {
                    bgcolor: viewFromQuery === view && location.pathname === '/dashboard' ? '#1661c0' : 'rgba(15,23,42,0.04)',
                  },
                }}
              >
                {view === 'feed' ? 'News Feed' : 'Dashboard'}
              </Button>
            ))}
          </Stack>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated && (
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navItems.map(
              (item) =>
                item.roles.includes(role) && (
                  <Button key={item.name} component={Link} to={item.path} sx={{ color: '#0f172a', textTransform: 'none', fontWeight: 500 }}>
                    {item.name}
                  </Button>
                )
            )}
          </Box>
        )}

        <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
          <IconButton>
            <MenuRoundedIcon />
          </IconButton>
        </Box>

        {isAuthenticated ? (
          <Button variant="contained" onClick={logout} sx={{ borderRadius: 999, ml: 1 }}>
            Logout
          </Button>
        ) : (
          <Button variant="outlined" component={Link} to="/login" sx={{ borderRadius: 999, ml: 1 }}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;