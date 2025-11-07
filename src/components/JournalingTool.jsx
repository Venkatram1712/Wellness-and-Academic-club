import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const JournalingTool = () => {
    const [entry, setEntry] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        if (entry.trim()) {
            // In a real app, this would save to local storage or an API
            console.log("Journal saved:", entry);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
            // Optionally clear the entry: setEntry('');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" color="secondary" gutterBottom>
                Guided Journaling Tool
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                "What is one thing you are grateful for today?"
            </Typography>
            <TextField
                label="Write your thoughts..."
                multiline
                rows={6}
                fullWidth
                value={entry}
                onChange={(e) => {
                    setEntry(e.target.value);
                    setIsSaved(false);
                }}
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.dark' } }}>
                {isSaved ? 'Saved!' : 'Save Entry'}
            </Button>
        </Paper>
    );
};

export default JournalingTool;