import React, { useState } from 'react';
import { Card, Box, Typography, Button, LinearProgress } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const HydrationTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const goal = 8;
  const progress = Math.min((glasses / goal) * 100, 100);

  return (
    <Card elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" color="info.main" gutterBottom>
        Daily Hydration Tracker
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <WaterDropIcon color="info" sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h4">
          <strong>{glasses}</strong> / {goal} servings
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 10, borderRadius: 5, mb: 2, '& .MuiLinearProgress-bar': { backgroundColor: '#3498db' } }}
      />

      <Box>
        <Button
          variant="contained"
          onClick={() => setGlasses((g) => g + 1)}
          disabled={glasses >= goal}
          sx={{ mr: 2, bgcolor: '#3498db', '&:hover': { bgcolor: '#2980b9' } }}
        >
          Log Intake
        </Button>
        <Button variant="outlined" onClick={() => setGlasses(0)}>
          Reset
        </Button>
      </Box>
    </Card>
  );
};

export default HydrationTracker;
