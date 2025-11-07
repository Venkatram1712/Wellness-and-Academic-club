import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserCard = ({ user }) => {
  // CRITICAL CHECK 1: If the user object itself is null/undefined, return nothing.
  if (!user) {
    return null; 
  }
  
  // Safe defaults in case role or name are missing, though they shouldn't be after login.
  const userName = user.name || user.username || 'Guest';
  const userRole = user.role || 'user'; // Assign a default if role is missing

  // Mock score logic remains the same
  const score = userRole === 'admin' ? 'N/A' : '85'; 

  // Function to capitalize the role safely
  const formattedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  
  // Function to capitalize the name safely
  const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <Card sx={{ maxWidth: 345, bgcolor: '#c0392b', color: 'white', mb: 4 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: '#e74c3c' }}>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div" fontWeight="bold">
              Welcome Back, {formattedName}!
            </Typography>
            <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>
              {user.email || 'N/A'}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.4)' }} />

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="body1">
            **Role:** {formattedRole}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            **Wellness Score:** <span style={{ color: '#FFEB3B' }}>{score} / 100</span>
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body1">
            **User:** {formattedName}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;