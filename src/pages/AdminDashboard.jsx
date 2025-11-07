import React, { useState } from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, Button, Box, List, ListItem, ListItemText, IconButton, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux'; // NEW IMPORTS
import api from '../lib/api';
import { addNewsArticle, deleteNewsArticle } from '../Redux/newsSlice'; // FIX: match actual folder casing

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const newsArticles = useSelector((state) => state.news.articles);
  const token = useSelector((s) => s.user.token);
  const [issues, setIssues] = React.useState([]);
  const [issuesError, setIssuesError] = React.useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAddNews = () => {
    if (newTitle && newContent) {
      const newArticle = {
        id: Date.now(), // Simple unique ID
        title: newTitle,
        content: newContent,
        date: new Date().toISOString().slice(0, 10),
      };
      dispatch(addNewsArticle(newArticle));
      setNewTitle('');
      setNewContent('');
    }
  };

  const handleDeleteNews = (id) => {
    dispatch(deleteNewsArticle(id));
  };

  React.useEffect(() => {
    const fetchIssues = async () => {
      try {
  const res = await api.get('/api/issues');
        setIssues(res.data.issues || []);
        setIssuesError('');
      } catch (err) {
        setIssuesError(err?.response?.data?.error || err.message);
      }
    };
    if (token) fetchIssues();
  }, [token]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom color="secondary">Admin Dashboard 🗄️</Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>Control and maintenance panel for the Wellness Hub.</Typography>

      {/* Admin Feature: Manage News Articles */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            Manage Student News & Announcements
          </Typography>
          
          {/* Add New Article Form */}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <TextField
              label="Article Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Article Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddNews} sx={{ bgcolor: '#2ecc71', '&:hover': { bgcolor: '#27ae60' } }}>
              Publish New Article
            </Button>
          </Box>

          {/* Existing Articles List */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Published Articles:</Typography>
          <List dense>
            {newsArticles.map((article) => (
              <ListItem 
                key={article.id} 
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNews(article.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText 
                  primary={article.title} 
                  secondary={`Published: ${article.date}`} 
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* User-reported issues */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            User-Reported Issues
          </Typography>
          {issuesError && (
            <Typography color="error" sx={{ mb: 1 }}>Failed to load issues: {issuesError}</Typography>
          )}
          <List dense>
            {issues.map((iss) => (
              <ListItem key={iss.id} alignItems="flex-start">
                <ListItemText
                  primary={`${iss.title} — by ${iss.username || 'unknown'}`}
                  secondary={`${iss.details}  (status: ${iss.status}, at: ${iss.created_at})`}
                />
              </ListItem>
            ))}
            {issues.length === 0 && !issuesError && (
              <Typography variant="body2" color="text.secondary">No issues reported yet.</Typography>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Placeholder for other Admin features (Usage Metrics, Resource CRUD) */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Usage Metrics & Reporting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Analytics and reporting will be available here.</Typography>
        </AccordionDetails>
      </Accordion>
      
    </Container>
  );
};

export default AdminDashboard;