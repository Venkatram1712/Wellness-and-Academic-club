import { Container, Typography, Grid, Stack, Card, CardContent } from '@mui/material';
import MoodTracker from '../components/MoodTracker';
import JournalingTool from '../components/JournalingTool';
import FocusPlanner from '../components/FocusPlanner';

const MentalHealth = () => (
    <Container sx={{ mt: 4, mb: 6 }}>
        <Stack spacing={4}>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom color="info.main">
                        Mental Health & Wellness 🧘
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Tools to pace your focus, capture moods, and keep admin-supplied care tips close.
                    </Typography>
                </CardContent>
            </Card>

            <FocusPlanner />

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <MoodTracker />
                </Grid>
                <Grid item xs={12} md={5}>
                    <JournalingTool />
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" color="secondary" gutterBottom>
                                Counselling & Crisis Support
                            </Typography>
                            <Typography>
                                *Links to confidential campus and national services will be placed here.*
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    </Container>
);

export default MentalHealth;