// src/pages/StudentDashboard.jsx - NEW IMPORT & MODIFICATION
import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import UserCard from '../components/Usercard';
import FeatureCard from '../components/Ui/FeatureCard';
import CommunityCard from '../components/Ui/CommunityCard';
import HeroCarousel from '../components/Ui/HeroCarousel';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const newsArticles = useSelector((state) => state.news?.articles || []);

  // Local wellness features list used to render FeatureCard components
  const wellnessFeatures = [
    {
      title: 'Physical Activity',
      description: 'Guided workouts and activity tracking to stay fit.',
      features: ['Daily workouts', 'Activity logs', 'Progress charts'],
      icon: '🏃',
      color: 'primary',
    },
    {
      title: 'Nutrition',
      description: 'Meal plans and nutrition tips for busy students.',
      features: ['Meal ideas', 'Calorie tracker', 'Healthy recipes'],
      icon: '🥗',
      color: 'secondary',
    },
    {
      title: 'Mindfulness',
      description: 'Short guided sessions and mental health resources.',
      features: ['Meditations', 'Counseling links', 'Stress tips'],
      icon: '🧘',
      color: 'primary',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Hero carousel */}
      <Box sx={{ mb: 3 }}>
        <HeroCarousel
          height={{ xs: 200, sm: 260, md: 320 }}
          items={[
            { src: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1600&auto=format&fit=crop', alt: 'Stay fit with guided workouts', href: '/fitness' },
            { src: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?q=80&w=1600&auto=format&fit=crop', alt: 'Mindfulness and wellbeing', href: '/mental-health' },
            { src: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1600&auto=format&fit=crop', alt: 'Join the community', href: '/community' },
          ]}
        />
      </Box>
      {user && <UserCard user={user} />}
      
      <Grid container spacing={3}>
        
        {/* News & Announcements Module (New) */}
        <Grid item xs={12}>
            <Paper elevation={4} sx={{ p: 3, mb: 4, borderLeft: '5px solid #c0392b' }}>
                <Typography variant="h5" color="primary" gutterBottom>
                    📰 Campus News & Announcements
                </Typography>
                <List dense>
                    {newsArticles.slice(0, 3).map((article) => ( // Show top 3
                        <ListItem key={article.id} disablePadding sx={{ borderBottom: '1px dotted #eee' }}>
                            <ListItemText 
                                primary={<strong>{article.title}</strong>}
                                secondary={`${article.content.substring(0, 70)}... (${article.date})`}
                                primaryTypographyProps={{ color: 'secondary.main' }}
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
                    <a href="#">View All News</a>
                </Typography>
            </Paper>
        </Grid>
        
        {/* Existing wellnessFeature Grid (md=4) */}
        {wellnessFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard
              title={feature.title}
              description={feature.description}
              features={feature.features}
              icon={feature.icon}
              color={feature.color}
            />
          </Grid>
        ))}
        
  {/* Existing Community Card and Progress Tracker sections (xs=12, md=6) */}
        {/* ... (Code for CommunityCard and Progress Tracker) ... */}

      </Grid>
    </Box>
  );
};

export default StudentDashboard;