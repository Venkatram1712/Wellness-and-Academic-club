import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const FeatureCard = ({ title, description, features, icon, color = 'primary', extraContent }) => {
  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%', 
        borderLeft: `5px solid`, 
        borderColor: `${color}.main`,
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 },
        transition: 'all 0.3s'
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom color={`${color}.main`}>
          {icon} {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {description}
        </Typography>
        <List dense disablePadding>
          {features.map((feature, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <CheckCircleOutlineIcon fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText primary={feature} primaryTypographyProps={{ fontSize: '0.9em' }} />
            </ListItem>
          ))}
        </List>
        {extraContent && (
          <Box mt={2} p={2} borderRadius={1} bgcolor="rgba(0,0,0,0.03)">
            {extraContent}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureCard;