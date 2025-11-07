import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, Snackbar, Alert } from '@mui/material';

const moods = [
    { label: 'Fantastic', emoji: '🤩', color: '#27ae60' },
    { label: 'Good', emoji: '😊', color: '#2980b9' },
    { label: 'Neutral', emoji: '😐', color: '#f39c12' },
    { label: 'Stressed', emoji: '😟', color: '#e74c3c' },
    { label: 'Awful', emoji: '😭', color: '#c0392b' },
];

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSelectMood = (mood) => {
        setSelectedMood(mood);
        setOpenSnackbar(true);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" color="info.main" gutterBottom>
                Daily Mood Check-in
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                How are you feeling right now?
            </Typography>
            <Grid container spacing={2}>
                {moods.map((mood) => (
                    <Grid item key={mood.label}>
                        <Button
                            variant={selectedMood?.label === mood.label ? "contained" : "outlined"}
                            onClick={() => handleSelectMood(mood)}
                            sx={{ 
                                bgcolor: selectedMood?.label === mood.label ? mood.color : 'transparent', 
                                color: selectedMood?.label === mood.label ? 'white' : mood.color,
                                borderColor: mood.color,
                                '&:hover': { bgcolor: mood.color, color: 'white', opacity: 0.9 },
                                transition: 'all 0.3s'
                            }}
                        >
                            {mood.emoji} {mood.label}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Mood recorded: {selectedMood?.label}!
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default MoodTracker;