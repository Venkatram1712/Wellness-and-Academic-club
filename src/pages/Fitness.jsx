import { Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import BMICalculator from '../components/BMICalculator';

const Fitness = () => {
    const trainers = useSelector((state) => state.trainers.items);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom color="success.main">
                Fitness & Nutrition Tools 💪
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Track your health metrics and access guided workouts curated by campus admins.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <BMICalculator />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h4" color="secondary" sx={{ mt: 3, mb: 2 }}>
                        Guided Trainer Workouts
                    </Typography>
                    <Grid container spacing={3}>
                        {trainers.map((trainer) => (
                            <Grid item xs={12} sm={6} md={4} key={trainer.id} sx={{ display: 'flex' }}>
                                <Card
                                    elevation={3}
                                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                                >
                                    {trainer.imageUrl && (
                                        <CardMedia component="img" height="200" image={trainer.imageUrl} alt={trainer.name} />
                                    )}
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {trainer.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {trainer.specialty}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            href={trainer.youtubeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ mt: 'auto' }}
                                        >
                                            Watch Workout Video
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        {trainers.length === 0 && (
                            <Grid item xs={12}>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No trainer workouts yet. Ask an admin to add some from the Admin dashboard.
                                    </Typography>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Fitness;