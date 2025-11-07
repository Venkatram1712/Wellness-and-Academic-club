import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Link } from 'react-router-dom';

const CommunityCard = () => {
  return (
    <Card 
      elevation={4} 
      sx={{ 
        height: '100%', 
        border: '1px dashed #c0392b', 
        bgcolor: '#fff9f9',
        p: 2, 
        textAlign: 'center'
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          <ForumIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" component="div" color="primary.main" fontWeight="bold">
            Community & Support Hub
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Connect with peers, participate in challenges, and get the help you need.
        </Typography>

        <Box display="flex" justifyContent="space-around" mb={3}>
            <Box>
                <SupportAgentIcon color="secondary" sx={{ fontSize: 28 }} />
                <Typography variant="body2" fontWeight="bold">Support Tickets</Typography>
            </Box>
            <Box>
                <EmojiEventsIcon color="success" sx={{ fontSize: 28 }} />
                <Typography variant="body2" fontWeight="bold">Group Challenges</Typography>
            </Box>
        </Box>
        
        <Button 
          variant="contained" 
          component={Link} 
          to="/community"
          sx={{ mt: 1, bgcolor: '#e74c3c', '&:hover': { bgcolor: '#c0392b' } }}
        >
          Go to Community Forum
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;