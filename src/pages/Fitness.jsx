import { Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material'; // NEW IMPORTS
import BMICalculator from '../components/BMICalculator';
import HydrationTracker from '../components/HydrationTracker';

// Sample data for trainers (including image URLs and YouTube links)
const trainers = [
    { 
        id: 1, 
        name: 'Sadguru', 
        specialty: 'Yoga & Meditation', 
        imageUrl: 'https://res.cloudinary.com/du850m0it/image/upload/v1762404994/Screenshot_2025-11-06_102557_k9fchl.png', // Placeholder
        youtubeLink: 'https://www.youtube.com/watch?v=EwQkfoKxRvo' 
    },
    { 
        id: 2, 
        name: 'Caroline Jordan', 
        specialty: 'workout for Stress And Anxiety Relief', 
        imageUrl: 'https://res.cloudinary.com/du850m0it/image/upload/v1762404759/youtube_dsbcbn.png', // Placeholder
        youtubeLink: 'https://www.youtube.com/watch?v=ah4PAK18Rtg' 
    }
];

const Fitness = () => (
  <Container sx={{ mt: 4 }}>
    <Typography variant="h3" gutterBottom color="success.main">
        Fitness & Nutrition Tools 💪
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Track your health metrics and access guided workouts.
    </Typography>

    <Grid container spacing={3}>
        {/* BMI and Hydration Tools (Existing Code) */}
        <Grid item xs={12} md={6}><BMICalculator /></Grid>
        <Grid item xs={12} md={6}><HydrationTracker /></Grid>
        
        {/* NEW Trainer Section */}
        <Grid item xs={12}>
            <Typography variant="h4" color="secondary" sx={{ mt: 3, mb: 2 }}>
                Guided Trainer Workouts
            </Typography>
            <Grid container spacing={3}>
                {trainers.map((trainer) => (
                    <Grid item xs={12} sm={6} key={trainer.id}>
                        <Card elevation={3}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={trainer.imageUrl} // Trainer Image
                                alt={trainer.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {trainer.name} ({trainer.specialty})
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="error" // Red for YouTube
                                    href={trainer.youtubeLink} 
                                    target="_blank"
                                    sx={{ mt: 1 }}
                                >
                                    Watch Workout Video
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Grid>
        
    </Grid>
  </Container>
);

export default Fitness;