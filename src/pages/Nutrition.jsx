import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadBmiResult } from '../lib/wellnessStorage';

const PLAN_LIBRARY = {
  underweight: {
    label: 'Nourish & Build',
    summary: 'Increase calories gently with ghee, nuts, paneer and lentils paired with gut-friendly ferments.',
    staples: ['Ragi malt with jaggery', 'Paneer bhurji with phulka', 'Dry-fruit laddoo'],
    mealPlan: [
      { title: 'Breakfast', items: ['Vegetable upma finished with ghee + sprouts chaat', 'Banana, peanut butter & date smoothie'] },
      { title: 'Lunch', items: ['Jeera rice with dal tadka, beetroot poriyal, curd', 'Handful of roasted peanuts post meal'] },
      { title: 'Snack', items: ['Sweet potato chaat with chaat masala', 'Masala chai sweetened with jaggery + almonds'] },
      { title: 'Dinner', items: ['Millet khichdi with moong dal and veggies', 'Turmeric milk before bed for recovery'] },
    ],
    hydration: 'Sip chaas or tender coconut water twice daily.',
    articles: [
      {
        title: 'Mini-meal cadence',
        summary: 'Eat every 3 hours—swap between poha, parathas, protein shakes and laddoos to avoid fullness yet add calories.',
      },
      {
        title: 'Protein from the thali',
        summary: 'Paneer, sprouts, dals and eggs should appear in every sitting. Add a spoon of ghee to each plate.',
      },
    ],
    spices: ['Asafoetida for digestion', 'Fenugreek sprouts', 'Ajwain to cut bloating'],
  },
  normal: {
    label: 'Maintain & Energise',
    summary: 'Keep a balanced plate with 50% veggies, 25% whole grains, 25% protein while rotating regional staples.',
    staples: ['Multimillet roti', 'Idli + sambar', 'Rajma-chawal'],
    mealPlan: [
      { title: 'Breakfast', items: ['Idli with podi, sambar and a bowl of fruit', 'Filter coffee without sugar or with jaggery'] },
      { title: 'Lunch', items: ['Bhakri with bharli vangi (stuffed brinjal), cucumber kosambari, chaas', 'Papaya wedge post meal'] },
      { title: 'Snack', items: ['Roasted makhana with curry leaves', 'Fresh lime water with rock salt'] },
      { title: 'Dinner', items: ['Grilled fish or paneer tikka with quinoa pulao', 'Warm jeera-infused water to aid sleep'] },
    ],
    hydration: '2–2.5L water, include kadha or herbal tea in evenings.',
    articles: [
      {
        title: 'Color-coded thali',
        summary: 'Use seasonal sabzis (palak, lauki, bhindi) to cover micronutrients without changing your cuisine.',
      },
      {
        title: 'Weekend prep ritual',
        summary: 'Batch-cook dals, sprouts and chutneys on Sunday so weekday plates stay balanced even during exams.',
      },
    ],
    spices: ['Turmeric + black pepper', 'Cinnamon for sugar balance', 'Ginger-garlic for immunity'],
  },
  overweight: {
    label: 'Lighten & Reset',
    summary: 'Prioritise fibre-rich sabzis, millets, lean protein and steamed snacks; avoid fried street food on weekdays.',
    staples: ['Moong dal cheela', 'Brown rice curd rice with veggies', 'Steamed dhokla'],
    mealPlan: [
      { title: 'Breakfast', items: ['Sprouted moong salad with lemon + coconut', 'Sattu drink sweetened with dates'] },
      { title: 'Lunch', items: ['Half plate koshimbir, quarter plate bajra roti, quarter plate dal/kadhi', 'Buttermilk seasoned with jeera'] },
      { title: 'Snack', items: ['Masala roasted chana + fox nuts', 'Green tea with tulsi leaves'],
      },
      { title: 'Dinner', items: ['Bottle-gourd soup with tofu/paneer cubes', 'Foxtail millet upma loaded with veggies'] },
    ],
    hydration: 'Infuse water with cucumber, mint, lemon; cap caffeine after 4pm.',
    articles: [
      {
        title: 'Half-plate salad rule',
        summary: 'Start meals with raw or lightly sautéed vegetables to control portions of rice/roti automatically.',
      },
      {
        title: 'Smart carb swaps',
        summary: 'Switch to red rice, barnyard millet, hand-pounded rice and include horse gram dal twice a week.',
      },
    ],
    spices: ['Jeera + ajwain water', 'Garam masala in moderation', 'Clove & black pepper for metabolism'],
  },
  obesity: {
    label: 'Metabolic Heal & Protect',
    summary: 'Pair low-GI carbs with high protein dals, load on leafy sabzis, and keep dinners super light yet satisfying.',
    staples: ['Mixed dal soup', 'Palak paneer with millet roti', 'Steamed idlis with podi oil'],
    mealPlan: [
      { title: 'Breakfast', items: ['Vegetable dalia with flaxseed powder', 'Unsweetened masala chai + boiled chana'] },
      { title: 'Lunch', items: ['Red rice or jowar roti, methi dal, lauki sabzi, salad + chaas', 'Fistful of roasted sunflower + pumpkin seeds'] },
      { title: 'Snack', items: ['Tomato rasam or clear veg soup', 'Sliced guava with chilli salt'] },
      { title: 'Dinner', items: ['Moong dal + spinach soup with tofu cubes', 'Steamed idlis with gunpowder and til oil'] },
    ],
    hydration: 'Warm jeera-ajwain water through the day; finish with turmeric latte before bed.',
    articles: [
      {
        title: 'Kitchen detox plan',
        summary: 'Keep ready-to-eat bhuna chana, khichdi mix, and cut veggies handy to avoid food delivery traps.',
      },
      {
        title: 'Weekly fasting window',
        summary: 'Adopt a 12-hour overnight fasting window with early dinners; pair with slow evening walks.',
      },
    ],
    spices: ['Fenugreek water', 'Curry leaves powder', 'Black cumin (kalonji) oil drizzle'],
  },
};

const MEAL_NOTES = {
  Breakfast: 'Anchor your morning with protein + fibre so glucose stays steady through lectures.',
  Lunch: 'Make half your thali raw or lightly sautéed veggies to balance grains automatically.',
  Snack: 'Sip water, breathe, then choose mindful munching to dodge stress-driven cravings.',
  Dinner: 'Close the kitchen early with calm flavours so sleep and recovery stay deep.',
};

const statusToKey = (status = '') => {
  const normalized = status.toLowerCase();
  if (normalized.includes('under')) return 'underweight';
  if (normalized.includes('normal')) return 'normal';
  if (normalized.includes('over')) return 'overweight';
  if (normalized.includes('obes')) return 'obesity';
  return null;
};

const formatTimestamp = (value) => {
  if (!value) return 'Not saved yet';
  try {
    return new Date(value).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
};

const Nutrition = () => {
  const { user } = useSelector((state) => state.user);
  const userKey = useMemo(() => user?.id || user?.email || user?.username || 'guest', [user?.id, user?.email, user?.username]);
  const [bmiSnapshot, setBmiSnapshot] = useState(() => loadBmiResult(userKey));

  useEffect(() => {
    setBmiSnapshot(loadBmiResult(userKey));
  }, [userKey]);

  const planKey = statusToKey(bmiSnapshot?.status);
  const plan = planKey ? PLAN_LIBRARY[planKey] : null;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Stack spacing={3}>
        <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Indian Nutrition Playbook
                </Typography>
                <Typography color="text.secondary">
                  Personalised using the BMI you saved on the Fitness page.
                </Typography>
              </Box>
              <Button component={Link} to="/fitness" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>
                Recalculate BMI
              </Button>
            </Stack>
            {bmiSnapshot ? (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current BMI
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="h3" fontWeight={700}>
                      {Number(bmiSnapshot.value).toFixed(1)}
                    </Typography>
                    <Chip label={bmiSnapshot.status} color="primary" sx={{ fontWeight: 600 }} />
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last saved
                  </Typography>
                  <Typography fontWeight={600}>{formatTimestamp(bmiSnapshot.updatedAt)}</Typography>
                </Box>
                {plan && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Plan focus
                    </Typography>
                    <Typography fontWeight={600}>{plan.label}</Typography>
                  </Box>
                )}
              </Stack>
            ) : (
              <Stack spacing={1}>
                <Typography variant="body1" color="error.main" fontWeight={600}>
                  No BMI saved yet.
                </Typography>
                <Typography color="text.secondary">
                  Calculate and save your BMI under the Fitness → Advanced BMI Calculator section to unlock this plan.
                </Typography>
              </Stack>
            )}
          </Stack>
        </Card>

        {plan ? (
          <>
            <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <RestaurantMenuRoundedIcon color="success" />
                  <Typography variant="h5" fontWeight={700}>
                    {plan.label}
                  </Typography>
                </Stack>
                <Typography color="text.secondary">{plan.summary}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {plan.staples.map((item) => (
                    <Chip key={item} label={item} variant="outlined" sx={{ mb: 1 }} />
                  ))}
                </Stack>
              </Stack>
            </Card>

            <Grid container spacing={3}>
              {plan.mealPlan.map((block) => (
                <Grid item xs={12} md={6} key={block.title}>
                  <Card sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocalDiningRoundedIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {block.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {MEAL_NOTES[block.title] || 'Stay intentional with portions and sit down to eat.'}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack spacing={1}>
                        {block.items.map((line) => (
                          <Box
                            key={line}
                            sx={{
                              p: 1.25,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              bgcolor: 'background.default',
                            }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {line}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {plan.articles.map((article) => (
                <Grid item xs={12} md={6} key={article.title}>
                  <Card sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <SpaRoundedIcon color="secondary" />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {article.title}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {article.summary}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>Hydration & Spice Therapy</Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {plan.hydration}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {plan.spices.map((spice) => (
                  <Chip key={spice} label={spice} color="secondary" variant="outlined" sx={{ mb: 1 }} />
                ))}
              </Stack>
            </Card>
          </>
        ) : (
          <Card sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Save your BMI to unlock Indian diet recommendations tailored to your body composition.
            </Typography>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default Nutrition;
