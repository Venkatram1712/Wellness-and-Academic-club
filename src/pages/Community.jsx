import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Box, TextField, Button, Alert } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import BugReportIcon from '@mui/icons-material/BugReport';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useSelector } from 'react-redux';
import api from '../lib/api';

// ... rest of the component code

const Community = () => {
  const { isAuthenticated } = useSelector((s) => s.user);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const submitIssue = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!title || !details) return setError('Please provide both title and details.');
    try {
      await api.post('/api/issues', { title, details });
      setSuccess('Thanks! Your report has been submitted.');
      setTitle('');
      setDetails('');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setError(`Could not submit report: ${msg}`);
    }
  };
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom color="primary">
        🤝 Community & Support Services
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        A safe space to connect, share experiences, and seek professional help.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <ChatIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h5">Discussion Forums & Chat</Typography>
            </Box>
            <List>
              <ListItem><ListItemIcon><GroupIcon /></ListItemIcon><ListItemText primary="Join topic-specific forums (e.g., 'Exam Stress', 'Fitness Tips')." /></ListItem>
              <ListItem><ListItemIcon><ChatIcon /></ListItemIcon><ListItemText primary="Peer-to-peer private chat for direct support." /></ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <SupportAgentIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h5">Technical & Mental Health Support</Typography>
            </Box>
            <List>
              <ListItem><ListItemIcon><SupportAgentIcon /></ListItemIcon><ListItemText primary="Raise a support ticket for technical issues or feature requests." /></ListItem>
              <ListItem><ListItemIcon><Typography variant="h6" color="error" fontWeight="bold">24/7</Typography></ListItemIcon><ListItemText primary="Direct link to campus and national mental health emergency services." /></ListItem>
            </List>

            {/* Error/Issue report form */}
            <Box component="form" onSubmit={submitIssue} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <BugReportIcon color="warning" />
                <Typography variant="h6">Report a problem</Typography>
              </Box>
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <TextField label="Details" value={details} onChange={(e) => setDetails(e.target.value)} required multiline minRows={3} />
              <Button type="submit" variant="contained" disabled={!isAuthenticated} title={!isAuthenticated ? 'Please login to submit' : ''}>
                Submit report
              </Button>
              {!isAuthenticated && (
                <Typography variant="caption" color="text.secondary">
                  You need to be logged in to submit a report.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" color="success.main" gutterBottom>
                    🏆 Group Challenges & Leaderboards
                </Typography>
                <Typography>
                    Participate in challenges (e.g., 10k Steps Challenge, Study Hour Goal) to earn badges and boost engagement.
                </Typography>
            </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Community;