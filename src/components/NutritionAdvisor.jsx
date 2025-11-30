import React, { useMemo, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Grid, Chip } from '@mui/material';

const planLibrary = {
  obesity: {
    label: 'Balanced weight-loss focus',
    meals: [
      'Breakfast: Greek yogurt parfait with berries and chia seeds',
      'Lunch: Grilled salmon with quinoa and roasted veggies',
      'Snack: Carrot sticks with hummus',
      'Dinner: Lentil soup with mixed greens',
    ],
    recipes: [
      {
        name: 'Rainbow Buddha Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        blurb: 'High-fiber bowl packed with colorful veggies, grains, and lean protein.',
      },
      {
        name: 'Herbed Lentil Soup',
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
        blurb: 'Comforting bowl loaded with plant protein to keep you full longer.',
      },
      {
        name: 'Citrus Greens Smoothie',
        image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=80',
        blurb: 'Vitamin-packed smoothie ideal for a light breakfast or snack.',
      },
    ],
  },
  underweight: {
    label: 'Nutrient-dense calorie boost',
    meals: [
      'Breakfast: Overnight oats with nut butter and banana',
      'Lunch: Whole-grain pasta with pesto chicken and veggies',
      'Snack: Trail mix with nuts, seeds, and dried fruit',
      'Dinner: Tofu stir-fry over brown rice with avocado slices',
    ],
    recipes: [
      {
        name: 'Power Protein Smoothie',
        image: 'https://images.unsplash.com/photo-1484981184820-2e84ea0af1a5?auto=format&fit=crop&w=600&q=80',
        blurb: 'Smoothie with oats, nut butter, and berries for sustained energy.',
      },
      {
        name: 'Avocado Chickpea Toast',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
        blurb: 'Healthy fats + protein for steady weight gain.',
      },
      {
        name: 'Peanut Noodle Bowl',
        image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80',
        blurb: 'Savory dish rich in calories and micronutrients.',
      },
    ],
  },
  stress: {
    label: 'Calming anti-inflammatory focus',
    meals: [
      'Breakfast: Warm oatmeal with walnuts and cinnamon',
      'Lunch: Chickpea salad wrap with leafy greens',
      'Snack: Dark chocolate square with herbal tea',
      'Dinner: Baked turkey meatballs with roasted sweet potatoes',
    ],
    recipes: [
      {
        name: 'Turmeric Latte',
        image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=600&q=80',
        blurb: 'Golden milk that helps reduce inflammation and calm the mind.',
      },
      {
        name: 'Mediterranean Tray Bake',
        image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=600&q=80',
        blurb: 'One-pan meal with olive oil, herbs, and colorful vegetables.',
      },
      {
        name: 'Berry Chia Yogurt Cups',
        image: 'https://images.unsplash.com/photo-1506086679526-a687158d81d4?auto=format&fit=crop&w=600&q=80',
        blurb: 'Mood-friendly snack that delivers omega-3s and probiotics.',
      },
    ],
  },
};

const defaultPlan = {
  label: 'Balanced student meal plan',
  meals: [
    'Breakfast: Spinach omelette with whole-grain toast',
    'Lunch: Chickpea bowl with mixed greens',
    'Snack: Apple slices with peanut butter',
    'Dinner: Grilled chicken, brown rice, and steamed broccoli',
  ],
  recipes: [
    {
      name: 'Veggie Quinoa Salad',
      image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80',
      blurb: 'Quick salad you can meal-prep for busy class days.',
    },
    {
      name: 'Stuffed Sweet Potatoes',
      image: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=600&q=80',
      blurb: 'Fiber-rich base filled with beans, salsa, and Greek yogurt.',
    },
    {
      name: 'Coconut Chickpea Curry',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      blurb: 'Budget-friendly curry that reheats perfectly.',
    },
  ],
};

const issues = Object.keys(planLibrary);

const NutritionAdvisor = () => {
  const [concern, setConcern] = useState('');
  const [plan, setPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const lookup = useMemo(() => ({ ...planLibrary, default: defaultPlan }), []);

  const randomize = (items, count = 2) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  };

  const handleSuggest = (event) => {
    event.preventDefault();
    const key = concern.trim().toLowerCase();
    const selected = lookup[key] || lookup.default;
    setPlan({ ...selected, key: key || 'general wellness' });
    setRecipes(randomize(selected.recipes));
  };

  return (
    <Card elevation={4} sx={{ p: 3 }}>
      <Typography variant="h5" color="secondary" gutterBottom>
        Nutrition Support Module
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Describe your nutrition concern (e.g., "obesity", "stress", "underweight") and we will suggest a meal plan plus healthy recipe ideas.
      </Typography>
      <Box component="form" onSubmit={handleSuggest} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <TextField
          label="Health concern"
          placeholder="E.g. obesity or stress"
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          helperText={`Try: ${issues.join(', ')}`}
        />
        <Button type="submit" variant="contained" color="primary">
          Get meal plan
        </Button>
      </Box>

      {plan && (
        <Box>
          <Chip label={`Focus: ${plan.label}`} color="success" sx={{ mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Suggested meals
          </Typography>
          {plan.meals.map((meal, index) => (
            <Typography key={meal} variant="body2" sx={{ mb: 0.5 }}>
              {index + 1}. {meal}
            </Typography>
          ))}

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Healthy recipes
          </Typography>
          <Grid container spacing={2}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.name}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <Box
                    component="img"
                    src={recipe.image}
                    alt={recipe.name}
                    sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {recipe.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recipe.blurb}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Card>
  );
};

export default NutritionAdvisor;
