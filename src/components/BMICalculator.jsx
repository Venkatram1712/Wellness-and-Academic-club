import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';

const BMICalculator = () => {
    const [weight, setWeight] = useState(''); // State for weight in kg
    const [height, setHeight] = useState(''); // State for height in cm
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState('');

    const calculateBmi = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100; // Convert cm to meters

        if (w > 0 && h > 0) {
            const calculatedBmi = (w / (h * h)).toFixed(2);
            setBmi(calculatedBmi);
            
            // Determine BMI status
            if (calculatedBmi < 18.5) {
                setStatus('Underweight');
            } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
                setStatus('Normal weight');
            } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
                setStatus('Overweight');
            } else {
                setStatus('Obesity');
            }
        } else {
            setBmi(null);
            setStatus('Please enter valid weight and height.');
        }
    };

    return (
        <Card elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" color="primary" gutterBottom>
                BMI Calculator
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ '& > :not(style)': { m: 1 } }}>
                <TextField
                    label="Weight (kg)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    variant="outlined"
                    size="small"
                />
                <TextField
                    label="Height (cm)"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    variant="outlined"
                    size="small"
                />
                <Button variant="contained" onClick={calculateBmi} sx={{ bgcolor: 'success.main', height: 40 }}>
                    Calculate
                </Button>
            </Box>
            {bmi && (
                <Box mt={2}>
                    <Typography variant="h6">Your BMI: **{bmi}**</Typography>
                    <Typography variant="body1">Status: **{status}**</Typography>
                </Box>
            )}
            {!bmi && status && (
                 <Typography color="error" mt={2}>{status}</Typography>
            )}
        </Card>
    );
};

export default BMICalculator;