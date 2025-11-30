import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Tabs,
    Tab,
    Grid,
    Stack,
    RadioGroup,
    FormControlLabel,
    Radio,
    Chip,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSelector } from 'react-redux';
import { loadBmiResult, saveBmiResult } from '../lib/wellnessStorage';

const statusColors = {
    'Underweight': '#3498db',
    'Normal weight': '#27ae60',
    'Overweight': '#f39c12',
    Obesity: '#e74c3c',
};

const statusDescriptions = {
    'Underweight': 'Consider nutrient-dense meals to move into the healthy range.',
    'Normal weight': 'Great job! Maintain your current habits to stay in this zone.',
    'Overweight': 'Focus on balanced meals and daily movement to reverse the trend.',
    Obesity: 'Work with a coach/clinician for a personalized plan; start with small daily changes.',
};

const BMICalculator = () => {
    const { user } = useSelector((state) => state.user);
    const userKey = user?.id || user?.email || user?.username || 'guest';

    const [unit, setUnit] = useState('metric');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [metricInputs, setMetricInputs] = useState({ height: '', weight: '' });
    const [imperialInputs, setImperialInputs] = useState({ feet: '', inches: '', weight: '' });
    const [result, setResult] = useState(() => {
        const saved = loadBmiResult(userKey);
        return saved?.value ? { bmi: Number(saved.value), status: saved.status } : null;
    });
    const [error, setError] = useState('');
    const [isSaved, setIsSaved] = useState(() => Boolean(loadBmiResult(userKey)?.value));
    const [saveMessage, setSaveMessage] = useState('');
    const saveMessageTimeout = useRef(null);

    useEffect(() => {
        const saved = loadBmiResult(userKey);
        setResult(saved?.value ? { bmi: Number(saved.value), status: saved.status } : null);
        setIsSaved(Boolean(saved?.value));
    }, [userKey]);

    useEffect(() => () => {
        if (saveMessageTimeout.current) {
            clearTimeout(saveMessageTimeout.current);
        }
    }, []);

    const describeBmi = (value) => {
        if (value < 18.5) return 'Underweight';
        if (value < 25) return 'Normal weight';
        if (value < 30) return 'Overweight';
        return 'Obesity';
    };

    const parseNumber = (value) => {
        const parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const calculateBmi = (event) => {
        event.preventDefault();
        setError('');

        const numericAge = parseInt(age, 10);
        if (age && (!Number.isFinite(numericAge) || numericAge < 2 || numericAge > 120)) {
            setError('Age must be between 2 and 120.');
            return;
        }

        let heightMeters = null;
        let weightKg = null;

        if (unit === 'metric') {
            const heightCm = parseNumber(metricInputs.height);
            const kg = parseNumber(metricInputs.weight);
            if (!heightCm || !kg) {
                setError('Please enter valid height (cm) and weight (kg).');
                return;
            }
            heightMeters = heightCm / 100;
            weightKg = kg;
        } else {
            const feet = parseNumber(imperialInputs.feet) || 0;
            const inches = parseNumber(imperialInputs.inches) || 0;
            const pounds = parseNumber(imperialInputs.weight);
            const totalInches = feet * 12 + inches;
            if (!totalInches || !pounds) {
                setError('Please enter valid height (ft/in) and weight (lbs).');
                return;
            }
            heightMeters = totalInches * 0.0254;
            weightKg = pounds * 0.45359237;
        }

        if (!heightMeters || heightMeters <= 0 || !weightKg || weightKg <= 0) {
            setError('We need positive numbers to calculate BMI.');
            return;
        }

        const bmiValue = weightKg / (heightMeters * heightMeters);
        const bmiRounded = Number(bmiValue.toFixed(1));
        const bmiStatus = describeBmi(bmiValue);
        const healthyMin = 18.5 * heightMeters * heightMeters;
        const healthyMax = 25 * heightMeters * heightMeters;
        const bmiPrime = bmiValue / 25;
        const ponderalIndex = weightKg / Math.pow(heightMeters, 3);

        const nextResult = {
            bmi: bmiRounded,
            status: bmiStatus,
            healthyWeightRange: [healthyMin.toFixed(1), healthyMax.toFixed(1)],
            heightCm: (heightMeters * 100).toFixed(0),
            bmiPrime: bmiPrime.toFixed(2),
            ponderalIndex: ponderalIndex.toFixed(2),
            age: numericAge || null,
            gender,
            lastUnit: unit,
        };

        setResult(nextResult);
        setIsSaved(false);
        setSaveMessage('');
    };

    const handleSaveResult = () => {
        if (!result?.bmi) return;
        saveBmiResult({ value: result.bmi, status: result.status }, userKey);
        setIsSaved(true);
        setSaveMessage('BMI saved. Head to the Nutrition page for a personalized Indian diet plan.');
        if (saveMessageTimeout.current) {
            clearTimeout(saveMessageTimeout.current);
        }
        saveMessageTimeout.current = setTimeout(() => setSaveMessage(''), 3500);
    };

    return (
        <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                    Advanced BMI Calculator
                </Typography>

                <Tabs
                    value={unit}
                    onChange={(_, val) => setUnit(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ mb: 2 }}
                >
                    <Tab value="metric" label="Metric Units" />
                    <Tab value="us" label="US Units" />
                </Tabs>

                <Box component="form" onSubmit={calculateBmi} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="25"
                                helperText="(optional)"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <RadioGroup
                                row
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="other" control={<Radio />} label="Prefer not to say" />
                            </RadioGroup>
                        </Grid>

                        {unit === 'metric' ? (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Height (cm)"
                                        type="number"
                                        value={metricInputs.height}
                                        onChange={(e) => setMetricInputs((prev) => ({ ...prev, height: e.target.value }))}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Weight (kg)"
                                        type="number"
                                        value={metricInputs.weight}
                                        onChange={(e) => setMetricInputs((prev) => ({ ...prev, weight: e.target.value }))}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={6} sm={4}>
                                    <TextField
                                        label="Height (ft)"
                                        type="number"
                                        value={imperialInputs.feet}
                                        onChange={(e) => setImperialInputs((prev) => ({ ...prev, feet: e.target.value }))}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <TextField
                                        label="Height (in)"
                                        type="number"
                                        value={imperialInputs.inches}
                                        onChange={(e) => setImperialInputs((prev) => ({ ...prev, inches: e.target.value }))}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Weight (lbs)"
                                        type="number"
                                        value={imperialInputs.weight}
                                        onChange={(e) => setImperialInputs((prev) => ({ ...prev, weight: e.target.value }))}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12}>
                            <Box display="flex" gap={2} flexWrap="wrap">
                                <Button type="submit" variant="contained" color="success">
                                    Calculate BMI
                                </Button>
                                <Button
                                    type="button"
                                    variant="text"
                                    onClick={() => {
                                        setMetricInputs({ height: '', weight: '' });
                                        setImperialInputs({ feet: '', inches: '', weight: '' });
                                        setResult(null);
                                        setError('');
                                    }}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {result && (
                    <Paper sx={{ mt: 3, p: 3, bgcolor: 'rgba(192,57,43,0.03)' }}>
                        <Typography variant="overline" color="text.secondary">
                            Result
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                            <Typography variant="h3" color="primary">
                                {result.bmi}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                kg/m²
                            </Typography>
                            <Chip
                                label={result.status}
                                sx={{
                                    bgcolor: statusColors[result.status] || 'primary.main',
                                    color: '#fff',
                                    fontWeight: 600,
                                }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {statusDescriptions[result.status] || 'BMI compares your weight to your height to estimate health risk.'}
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleOutlineIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Healthy BMI range"
                                    secondary="18.5 kg/m² – 25 kg/m²"
                                />
                            </ListItem>
                            {result.healthyWeightRange && (
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleOutlineIcon fontSize="small" color="action" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`Healthy weight for ${result.heightCm || 'your'} cm`}
                                        secondary={`${result.healthyWeightRange[0]} – ${result.healthyWeightRange[1]} kg`}
                                    />
                                </ListItem>
                            )}
                            {result.bmiPrime && (
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleOutlineIcon fontSize="small" color="action" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="BMI Prime"
                                        secondary={`${result.bmiPrime} (ratio vs. the upper healthy limit)`}
                                    />
                                </ListItem>
                            )}
                            {result.ponderalIndex && (
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleOutlineIcon fontSize="small" color="action" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Ponderal Index"
                                        secondary={`${result.ponderalIndex} kg/m³`}
                                    />
                                </ListItem>
                            )}
                        </List>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveResult}
                                disabled={!result?.bmi || isSaved}
                            >
                                {isSaved ? 'BMI Saved' : 'Save BMI'}
                            </Button>
                            <Typography variant="body2" color={isSaved ? 'success.main' : 'text.secondary'}>
                                {isSaved
                                    ? 'Latest BMI is synced with your Nutrition plan.'
                                    : 'Save this BMI to unlock diet guidance on the Nutrition page.'}
                            </Typography>
                        </Stack>
                        {saveMessage && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {saveMessage}
                            </Alert>
                        )}
                    </Paper>
                )}
            </CardContent>
        </Card>
    );
};

export default BMICalculator;