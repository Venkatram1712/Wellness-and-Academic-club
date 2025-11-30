import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BedtimeRoundedIcon from '@mui/icons-material/BedtimeRounded';
import OpacityRoundedIcon from '@mui/icons-material/OpacityRounded';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const FALLBACK_HERO_STORIES = [
  {
    id: 'hero-1',
    category: 'Wellness',
    title: 'Reset your semester with mindful routines',
    description: 'Micro-habits that improve focus, recovery, and classroom performance.',
    readTime: '4 min read',
    views: 18400,
    date: 'Nov 28, 2025',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'hero-2',
    category: 'Fitness',
    title: 'Campus athletes share their recovery stack',
    description: 'Stretch flows, hydration cues, and playlists to keep you motivated.',
    readTime: '6 min read',
    views: 12980,
    date: 'Nov 26, 2025',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'hero-3',
    category: 'Community',
    title: 'Peer mentors on building supportive study circles',
    description: 'How small accountability groups improve grades and mental health.',
    readTime: '5 min read',
    views: 9800,
    date: 'Nov 24, 2025',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
  },
];

const FALLBACK_ARTICLES = [
  {
    id: 'a1',
    category: 'Mindfulness',
    title: 'Breathe better before presentations',
    description: 'A two-minute breathing ladder to calm nerves before public speaking.',
    readTime: '3 min read',
    views: 6320,
    date: 'Nov 27, 2025',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a2',
    category: 'Nutrition',
    title: 'Budget-friendly fuel for finals week',
    description: 'Five meals under $5 that still hit your macro targets.',
    readTime: '4 min read',
    views: 7120,
    date: 'Nov 26, 2025',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a3',
    category: 'Sleep',
    title: 'Night-shift students share wind-down tactics',
    description: 'Simple lighting and journaling tweaks to improve deep sleep.',
    readTime: '5 min read',
    views: 5480,
    date: 'Nov 25, 2025',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a4',
    category: 'Community',
    title: 'Study buddy requests doubled this month',
    description: 'Here is how to host a themed study sprint that actually fills up.',
    readTime: '2 min read',
    views: 4360,
    date: 'Nov 24, 2025',
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a5',
    category: 'Fitness',
    title: 'Mobility drills for cramped dorm rooms',
    description: 'No equipment flows coaches recommend between long lecture blocks.',
    readTime: '3 min read',
    views: 3890,
    date: 'Nov 24, 2025',
    image: 'https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a6',
    category: 'Food',
    title: 'Culinary Adventures: Global Cuisines',
    description: 'A journey through the most exciting and delicious foods from around the globe.',
    readTime: '2 min read',
    views: 6340,
    date: 'Nov 23, 2025',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
  },
];

const recommendations = {
  sleep: [
    'Aim for 7-9 hours of sleep per night',
    'Maintain a consistent sleep schedule',
    'Avoid screens 1 hour before bedtime',
    'Keep your bedroom cool and dark',
  ],
  water: [
    'Drink 2000-3000ml of water daily',
    'Increase intake during exercise',
    'Monitor urine color for hydration',
    'Spread water intake throughout the day',
  ],
};

const tipCards = [
  {
    title: 'Quality Sleep',
    description: 'Consistent sleep patterns improve cognition and overall health. Try to go to bed and wake up at the same time every day.',
  },
  {
    title: 'Stay Hydrated',
    description: 'Proper hydration supports metabolism, skin health, and energy levels. Keep a water bottle nearby as a reminder.',
  },
];

const StatRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center" color="rgba(255,255,255,0.9)">
    {icon}
    <Typography variant="caption">{label}</Typography>
    <Typography variant="caption" sx={{ opacity: 0.8 }}>
      •
    </Typography>
    <Typography variant="caption">{value}</Typography>
  </Stack>
);

const ArticleCard = ({ article }) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 3,
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 45px rgba(15,23,42,0.12)',
    }}
  >
    <Box
      component="img"
      src={article.image}
      alt={article.title}
      sx={{
        width: '100%',
        height: 200,
        objectFit: 'cover',
        borderRadius: 3,
        mb: 2,
      }}
    />
    <Chip
      label={article.category}
      size="small"
      color="default"
      sx={{
        alignSelf: 'flex-start',
        fontWeight: 600,
        bgcolor: alpha('#0b57d0', 0.1),
        color: '#0b57d0',
        mb: 1.5,
      }}
    />
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
      {article.title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      {article.description}
    </Typography>
    <Stack direction="row" spacing={2} flexWrap="wrap" color="text.secondary">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <AccessTimeRoundedIcon fontSize="small" />
        <Typography variant="caption">{article.readTime}</Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <VisibilityRoundedIcon fontSize="small" />
        <Typography variant="caption">{formatNumber(article.views)}</Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <EventAvailableRoundedIcon fontSize="small" />
        <Typography variant="caption">{article.date}</Typography>
      </Stack>
    </Stack>
  </Card>
);

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const articles = useSelector((state) => state.news.articles);
  const location = useLocation();
  const [activeView, setActiveView] = useState('feed');
  const [activeSlide, setActiveSlide] = useState(0);
  const [sleepValue, setSleepValue] = useState(7.5);
  const [waterValue, setWaterValue] = useState(2100);
  const [inputs, setInputs] = useState({ sleep: '', water: '' });

  const heroStories = articles.length ? articles : FALLBACK_HERO_STORIES;
  const latestArticles = (articles.length ? articles : FALLBACK_ARTICLES).slice(0, 2);
  const heroCount = heroStories.length;

  useEffect(() => {
    if (!heroCount) return undefined;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroCount]);

  useEffect(() => {
    if (heroCount === 0) return;
    if (activeSlide >= heroCount) {
      setActiveSlide(0);
    }
  }, [heroCount, activeSlide]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'dashboard' || view === 'feed') {
      setActiveView(view);
    }
  }, [location.search]);

  useEffect(() => {
    const handler = (event) => {
      if (event?.detail === 'dashboard' || event?.detail === 'feed') {
        setActiveView(event.detail);
      }
    };
    window.addEventListener('newshub:set-view', handler);
    return () => window.removeEventListener('newshub:set-view', handler);
  }, []);

  const slide = heroStories[activeSlide] || heroStories[0] || FALLBACK_HERO_STORIES[0];

  const formatViewsWithLabel = (value) => `${formatNumber(value)} views`;

  const handleMetricUpdate = (type) => {
    const rawValue = inputs[type];
    if (!rawValue) return;
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed) || parsed <= 0) return;
    if (type === 'sleep') {
      setSleepValue(parsed);
    } else {
      setWaterValue(parsed);
    }
    setInputs((prev) => ({ ...prev, [type]: '' }));
  };

  const sleepStatus = useMemo(() => {
    if (sleepValue >= 7) {
      return { label: 'Optimal sleep duration!', tone: 'success' };
    }
    return { label: 'Too little sleep! Risk of fatigue and health issues.', tone: 'error' };
  }, [sleepValue]);

  const waterStatus = useMemo(() => {
    if (waterValue >= 2000) {
      return { label: 'Great hydration level!', tone: 'success' };
    }
    return { label: 'Dehydration risk! Drink more water.', tone: 'error' };
  }, [waterValue]);

  const healthHighlights = [
    {
      id: 'score',
      label: 'Health Score',
      value: 95,
      icon: <MonitorHeartRoundedIcon />, 
      iconColor: '#1a73e8',
      iconBg: 'linear-gradient(135deg,#e0edff,#f5f9ff)',
    },
    {
      id: 'progress',
      label: 'Weekly Progress',
      value: '+12%',
      icon: <TrendingUpRoundedIcon />, 
      iconColor: '#16a34a',
      iconBg: 'linear-gradient(135deg,#e7fff4,#f4fff9)',
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: user?.alerts ?? 0,
      icon: <NotificationsActiveRoundedIcon />, 
      iconColor: '#a855f7',
      iconBg: 'linear-gradient(135deg,#f6edff,#fbf8ff)',
    },
  ];

  const metricCards = [
    {
      id: 'sleep',
      label: 'Sleep Duration',
      value: sleepValue,
      unit: 'hours',
      status: sleepStatus,
      inputPlaceholder: 'Enter hours (e.g., 7.5)',
      icon: <BedtimeRoundedIcon />,
      iconColor: '#7c3aed',
      iconBg: 'rgba(124,58,237,0.12)',
    },
    {
      id: 'water',
      label: 'Water Intake',
      value: waterValue,
      unit: 'ml',
      status: waterStatus,
      inputPlaceholder: 'Enter ml (e.g., 2000)',
      icon: <OpacityRoundedIcon />,
      iconColor: '#0ea5e9',
      iconBg: 'rgba(14,165,233,0.12)',
    },
  ];

  const renderHero = () => (
    <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', height: { xs: 280, md: 360 }, boxShadow: '0 40px 80px rgba(15,23,42,0.3)' }}>
      {heroStories.map((story, idx) => (
        <Box
          key={story.id}
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: activeSlide === idx ? 1 : 0,
            transition: 'opacity 600ms ease',
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url(${story.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: { xs: 3, md: 4 }, color: '#fff', gap: 1.5 }}>
        <Chip
          label={slide.category}
          size="small"
          sx={{ alignSelf: 'flex-start', bgcolor: alpha('#0b57d0', 0.9), color: '#fff', fontWeight: 600 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, maxWidth: { md: '60%' } }}>
          {slide.title}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: { md: '60%' }, color: alpha('#fff', 0.9) }}>
          {slide.description}
        </Typography>
        <StatRow icon={<AccessTimeRoundedIcon fontSize="small" />} label={slide.readTime} value={formatViewsWithLabel(slide.views)} />
      </Box>
      <IconButton
        aria-label="Previous story"
        onClick={() => setActiveSlide((prev) => (prev - 1 + heroStories.length) % heroStories.length)}
        sx={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', bgcolor: '#fff', boxShadow: 3 }}
      >
        <ChevronLeftRoundedIcon />
      </IconButton>
      <IconButton
        aria-label="Next story"
        onClick={() => setActiveSlide((prev) => (prev + 1) % heroStories.length)}
        sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', bgcolor: '#fff', boxShadow: 3 }}
      >
        <ChevronRightRoundedIcon />
      </IconButton>
      <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
        {heroStories.map((story, idx) => (
          <Box
            key={story.id}
            onClick={() => setActiveSlide(idx)}
            sx={{ width: idx === activeSlide ? 30 : 10, height: 10, borderRadius: 999, bgcolor: idx === activeSlide ? '#fff' : alpha('#fff', 0.5), cursor: 'pointer', transition: 'all 0.3s ease' }}
          />
        ))}
      </Stack>
    </Box>
  );

  const renderNewsGrid = () => (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {latestArticles.map((article) => (
        <Grid item xs={12} md={6} key={article.id}>
          <ArticleCard article={article} />
        </Grid>
      ))}
      {latestArticles.length === 0 && (
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No articles yet. Use the admin module to publish your first story.
            </Typography>
          </Card>
        </Grid>
      )}
    </Grid>
  );

  const renderRecommendations = (type) => (
    <Box component="ul" sx={{ pl: 3, color: 'text.secondary', mb: 0 }}>
      {recommendations[type].map((item) => (
        <li key={item}>
          <Typography variant="body2">{item}</Typography>
        </li>
      ))}
    </Box>
  );

  const renderHealthCards = () => (
    <Stack spacing={3} sx={{ mt: 1 }}>
      <Grid container spacing={3} alignItems="stretch">
        {healthHighlights.map((highlight) => (
          <Grid item xs={12} md={4} key={highlight.id}>
            <Card sx={{ p: 3, borderRadius: 4, bgcolor: '#fff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 24px 55px rgba(15,23,42,0.08)' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center', background: highlight.iconBg }}>
                  {React.cloneElement(highlight.icon, { sx: { color: highlight.iconColor } })}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {highlight.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="text.primary">
                    {highlight.value}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} alignItems="stretch">
        {metricCards.map((card) => (
          <Grid item xs={12} md={6} key={card.id}>
            <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 24px 55px rgba(15,23,42,0.08)' }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: card.iconBg }}>
                    {React.cloneElement(card.icon, { sx: { color: card.iconColor } })}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {card.label}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography variant="h3" fontWeight={700}>
                    {card.value}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {card.unit}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: 3,
                    px: 2,
                    py: 1.25,
                    bgcolor: card.status.tone === 'success' ? alpha('#10b981', 0.12) : alpha('#ef4444', 0.12),
                    color: card.status.tone === 'success' ? '#0f9d58' : '#c62828',
                  }}
                >
                  {card.status.tone === 'success' ? <CheckCircleRoundedIcon fontSize="small" /> : <WarningAmberRoundedIcon fontSize="small" />}
                  <Typography variant="body2" fontWeight={600}>
                    {card.status.label}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Update Value
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'flex-end' }} sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      placeholder={card.inputPlaceholder}
                      value={inputs[card.id]}
                      onChange={(e) => setInputs((prev) => ({ ...prev, [card.id]: e.target.value }))}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleMetricUpdate(card.id)}
                      sx={{ minWidth: 140, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                      Update
                    </Button>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Recommendations
                  </Typography>
                  {renderRecommendations(card.id)}
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg,#f5f7ff,#f0fdf4)', border: '1px solid rgba(15,23,42,0.08)' }}>
        <Grid container spacing={2}>
          {tipCards.map((tip) => (
            <Grid item xs={12} md={6} key={tip.title}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {tip.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tip.description}
                </Typography>
              </CardContent>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Stack>
  );

  const lastUpdated = new Date().toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {activeView === 'feed' && renderHero()}

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {activeView === 'feed' ? 'Latest Articles' : 'Health Dashboard'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {activeView === 'feed'
              ? 'Discover the newest stories and updates'
              : 'Track your daily health metrics and receive personalized insights'}
          </Typography>
          {activeView === 'dashboard' && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            onClick={() => setActiveView('feed')}
            sx={{
              borderRadius: 999,
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: activeView === 'feed' ? '#1a73e8' : '#f4f6fb',
              color: activeView === 'feed' ? '#fff' : '#0f172a',
              boxShadow: activeView === 'feed' ? '0 12px 24px rgba(26,115,232,0.35)' : 'inset 0 0 0 1px rgba(15,23,42,0.08)',
              '&:hover': {
                bgcolor: activeView === 'feed' ? '#1557b0' : '#e2e8f0',
              },
            }}
          >
            News Feed
          </Button>
          <Button
            onClick={() => setActiveView('dashboard')}
            sx={{
              borderRadius: 999,
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: activeView === 'dashboard' ? '#1a73e8' : '#f4f6fb',
              color: activeView === 'dashboard' ? '#fff' : '#0f172a',
              boxShadow: activeView === 'dashboard' ? '0 12px 24px rgba(26,115,232,0.35)' : 'inset 0 0 0 1px rgba(15,23,42,0.08)',
              '&:hover': {
                bgcolor: activeView === 'dashboard' ? '#1557b0' : '#e2e8f0',
              },
            }}
          >
            Dashboard
          </Button>
        </Stack>
      </Stack>

      {activeView === 'feed' ? renderNewsGrid() : renderHealthCards()}
    </Box>
  );
};

export default StudentDashboard;

function formatNumber(value) {
  if (typeof value === 'number') return value.toLocaleString();
  if (!value) return '0';
  return value;
}