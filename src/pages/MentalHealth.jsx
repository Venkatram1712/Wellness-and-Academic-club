import { Container, Typography, Grid } from '@mui/material';
import MoodTracker from '../components/MoodTracker'; // NEW IMPORT
import JournalingTool from '../components/JournalingTool'; // NEW IMPORT

const MentalHealth = () => (
  <Container sx={{ mt: 4 }}>
    <Typography variant="h3" gutterBottom color="info.main">
        Mental Health & Wellness 🧘
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Tools and resources to manage stress, track your mood, and support your emotional health.
    </Typography>

    <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
            <MoodTracker />
        </Grid>
        <Grid item xs={12} md={5}>
            <JournalingTool />
        </Grid>

        <Grid item xs={12}>
            <Typography variant="h5" sx={{ mt: 2 }} color="secondary">
                Counselling & Crisis Support
            </Typography>
            <Typography>
                *Links to confidential campus and national services will be placed here.*
            </Typography>
        </Grid>
    </Grid>
  </Container>
);

export default MentalHealth;