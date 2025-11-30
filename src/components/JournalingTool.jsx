import React, { useEffect, useMemo, useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { loadJournalEntry, saveJournalEntry } from '../lib/wellnessStorage';

const JournalingTool = () => {
    const { user } = useSelector((state) => state.user);
    const userKey = useMemo(() => user?.id || user?.email || user?.username || 'guest', [user?.id, user?.email, user?.username]);
    const [entry, setEntry] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = loadJournalEntry(userKey);
        if (saved?.text) {
            setEntry(saved.text);
        }
    }, [userKey]);

    const handleSave = () => {
        const trimmed = entry.trim();
        if (!trimmed) return;
        saveJournalEntry(trimmed, userKey);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
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