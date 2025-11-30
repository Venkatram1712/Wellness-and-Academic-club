import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useSelector, useDispatch } from 'react-redux';
import api from '../lib/api';
import { addNewsArticle, deleteNewsArticle, updateNewsArticle } from '../Redux/newsSlice';
import { addTrainer, deleteTrainer, updateTrainer } from '../Redux/trainerSlice';
import { addEvent as addCommunityEvent, approveEvent, rejectEvent } from '../Redux/communitySlice';
import { addTip as addMentalTip, deleteTip as deleteMentalTip } from '../Redux/mentalTipsSlice';
import { replaceIssues } from '../Redux/issuesSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const newsArticles = useSelector((state) => state.news.articles);
  const trainerWorkouts = useSelector((state) => state.trainers.items);
  const communityEvents = useSelector((state) => state.community.events);
  const pendingEventRequests = useSelector((state) => state.community.pendingRequests);
  const mentalTips = useSelector((state) => state.mentalTips.tips);
  const token = useSelector((s) => s.user.token);
  const adminDisplayName = useSelector(
    (s) => s.user.user?.displayName || s.user.user?.name || s.user.user?.username || 'Campus Admin'
  );
  const issues = useSelector((state) => state.issues.items);
  const [issuesError, setIssuesError] = React.useState('');
  const [copyMessage, setCopyMessage] = React.useState('');
  const categoryOptions = ['Technology', 'Health', 'Business', 'Science', 'Travel', 'Food'];

  const emptyArticle = useMemo(
    () => ({
      title: '',
      description: '',
      category: 'Technology',
      readTime: '5 min read',
      views: '5000',
      date: new Date().toISOString().slice(0, 10),
      image: '',
    }),
    []
  );

  const [formData, setFormData] = useState(emptyArticle);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  const emptyTrainer = useMemo(
    () => ({
      name: '',
      specialty: '',
      imageUrl: '',
      youtubeLink: '',
    }),
    []
  );
  const [trainerForm, setTrainerForm] = useState(emptyTrainer);
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [trainerError, setTrainerError] = useState('');

  const emptyEvent = useMemo(
    () => ({
      title: '',
      location: '',
      date: '',
      time: '',
      imageUrl: '',
      description: '',
    }),
    []
  );
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [eventError, setEventError] = useState('');
  const [tipForm, setTipForm] = useState({ text: '', author: adminDisplayName });
  const [tipError, setTipError] = useState('');

  const handleFormChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ ...emptyArticle, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
    setFormError('');
  };

  const handleSubmitArticle = () => {
    if (!formData.title || !formData.description || !formData.image) {
      setFormError('Title, description, and image URL are required.');
      return;
    }
    const payload = {
      ...formData,
      id: editingId ?? Date.now(),
      views: Number(formData.views) || 0,
    };

    if (editingId) {
      dispatch(updateNewsArticle(payload));
    } else {
      dispatch(addNewsArticle(payload));
    }
    resetForm();
  };

  const handleDeleteNews = (id) => {
    dispatch(deleteNewsArticle(id));
    if (editingId === id) {
      resetForm();
    }
  };

  const handleTrainerChange = (field) => (event) => {
    const { value } = event.target;
    setTrainerForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetTrainerForm = () => {
    setTrainerForm(emptyTrainer);
    setEditingTrainerId(null);
    setTrainerError('');
  };

  const handleTrainerSubmit = () => {
    if (!trainerForm.name || !trainerForm.specialty || !trainerForm.youtubeLink) {
      setTrainerError('Name, specialty, and video link are required.');
      return;
    }
    const payload = {
      ...trainerForm,
      id: editingTrainerId ?? Date.now(),
    };
    if (editingTrainerId) {
      dispatch(updateTrainer(payload));
    } else {
      dispatch(addTrainer(payload));
    }
    resetTrainerForm();
  };

  const handleEditTrainer = (trainer) => {
    setTrainerForm({
      name: trainer.name,
      specialty: trainer.specialty,
      imageUrl: trainer.imageUrl,
      youtubeLink: trainer.youtubeLink,
    });
    setEditingTrainerId(trainer.id);
    setTrainerError('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteTrainer = (id) => {
    dispatch(deleteTrainer(id));
    if (editingTrainerId === id) {
      resetTrainerForm();
    }
  };

  const handleEventChange = (field) => (event) => {
    const { value } = event.target;
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetEventForm = () => {
    setEventForm(emptyEvent);
    setEventError('');
  };

  const handlePublishEvent = () => {
    if (!eventForm.title || !eventForm.location || !eventForm.date || !eventForm.time || !eventForm.imageUrl) {
      setEventError('Title, Indian location, date, time, and a banner image are required.');
      return;
    }
    dispatch(
      addCommunityEvent({
        ...eventForm,
        createdBy: adminDisplayName,
      })
    );
    resetEventForm();
  };

  const handleApproveEvent = (id) => {
    dispatch(approveEvent(id));
  };

  const handleRejectEvent = (id) => {
    dispatch(rejectEvent(id));
  };

  const handleTipChange = (field) => (event) => {
    const { value } = event.target;
    setTipForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetTipForm = () => {
    setTipForm({ text: '', author: adminDisplayName });
    setTipError('');
  };

  const handleTipSubmit = () => {
    if (!tipForm.text?.trim()) {
      setTipError('Share a concise tip before publishing.');
      return;
    }
    dispatch(
      addMentalTip({
        text: tipForm.text.trim(),
        author: tipForm.author?.trim() || adminDisplayName,
      })
    );
    resetTipForm();
  };

  const handleDeleteTip = (id) => {
    dispatch(deleteMentalTip(id));
  };

  const handleEditNews = (article) => {
    setFormData({
      title: article.title,
      description: article.description,
      category: article.category,
      readTime: article.readTime,
      views: String(article.views ?? ''),
      date: article.date,
      image: article.image,
    });
    setEditingId(article.id);
    setFormError('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const fetchIssues = async () => {
      if (!token) return;
      try {
        const res = await api.get('/api/issues');
        const serverIssues = res.data.issues || [];
        dispatch(replaceIssues(serverIssues));
        setIssuesError('');
      } catch (err) {
        setIssuesError((err?.response?.data?.error || err.message) + ' — showing cached reports.');
      }
    };
    fetchIssues();
  }, [token, dispatch]);

  React.useEffect(() => {
    setTipForm((prev) => ({ ...prev, author: adminDisplayName }));
  }, [adminDisplayName]);

  const handleCopyToken = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopyMessage('Token copied to clipboard');
    } catch (err) {
      console.error('Failed to copy admin token to clipboard', err);
      setCopyMessage('Copy not supported in this browser');
    }
    setTimeout(() => setCopyMessage(''), 2500);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom color="secondary">Admin Dashboard 🗄️</Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>Control and maintenance panel for the Wellness Hub.</Typography>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
            Admin Access Token
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use this token when testing protected admin APIs. Keep it private.
          </Typography>
          <TextField
            label="Current token"
            value={token || 'Token unavailable'}
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Button variant="contained" onClick={handleCopyToken} disabled={!token}>
              Copy token
            </Button>
            {copyMessage && (
              <Typography variant="body2" color="secondary">
                {copyMessage}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Admin Feature: Manage News Articles */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            Manage Student News & Announcements
          </Typography>
          
          {/* Add or Edit Article Form */}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }} onSubmit={(e) => e.preventDefault()}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Article Title"
                value={formData.title}
                onChange={handleFormChange('title')}
                fullWidth
              />
              <TextField
                label="Category"
                select
                value={formData.category}
                onChange={handleFormChange('category')}
                fullWidth
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Short Description"
              value={formData.description}
              onChange={handleFormChange('description')}
              multiline
              rows={3}
              fullWidth
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Read Time"
                value={formData.readTime}
                onChange={handleFormChange('readTime')}
                fullWidth
              />
              <TextField
                label="Views"
                type="number"
                value={formData.views}
                onChange={handleFormChange('views')}
                fullWidth
              />
              <TextField
                label="Publish Date"
                type="text"
                value={formData.date}
                onChange={handleFormChange('date')}
                fullWidth
                helperText="Example: Nov 28, 2025"
              />
            </Stack>
            <TextField
              label="Hero / Card Image URL"
              value={formData.image}
              onChange={handleFormChange('image')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            {formData.image && (
              <Box
                component="img"
                src={formData.image}
                alt="Article preview"
                sx={{
                  width: '100%',
                  maxHeight: 240,
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid rgba(15,23,42,0.08)',
                }}
              />
            )}
            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleSubmitArticle}>
                {editingId ? 'Update Article' : 'Publish New Article'}
              </Button>
              {editingId && (
                <Button variant="text" onClick={resetForm}>
                  Cancel edit
                </Button>
              )}
            </Stack>
          </Box>

          {/* Existing Articles Grid */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Published Articles ({newsArticles.length})
          </Typography>
          <Grid container spacing={2}>
            {newsArticles.map((article) => (
              <Grid item xs={12} md={6} key={article.id}>
                <Card sx={{ height: '100%' }}>
                  {article.image ? (
                    <Box
                      component="img"
                      src={article.image}
                      alt={article.title}
                      sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ height: 180, display: 'grid', placeItems: 'center', bgcolor: 'rgba(15,23,42,0.04)' }}>
                      <ImageIcon color="disabled" fontSize="large" />
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      {article.category} • {article.readTime}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {article.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {article.views?.toLocaleString?.() || article.views} views • Published: {article.date}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button startIcon={<EditIcon />} onClick={() => handleEditNews(article)}>
                      Edit
                    </Button>
                    <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteNews(article.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {newsArticles.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No articles yet. Use the form above to add the first post.
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Trainer Workouts Management */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            Guided Trainer Workouts
          </Typography>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }} onSubmit={(e) => e.preventDefault()}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Trainer name" value={trainerForm.name} onChange={handleTrainerChange('name')} fullWidth />
              <TextField label="Specialty / Focus" value={trainerForm.specialty} onChange={handleTrainerChange('specialty')} fullWidth />
            </Stack>
            <TextField label="Cover image URL" value={trainerForm.imageUrl} onChange={handleTrainerChange('imageUrl')} fullWidth />
            <TextField
              label="YouTube or streaming link"
              value={trainerForm.youtubeLink}
              onChange={handleTrainerChange('youtubeLink')}
              fullWidth
              helperText="Paste the public workout link students should follow"
            />
            {trainerForm.imageUrl && (
              <Box component="img" src={trainerForm.imageUrl} alt="Trainer preview" sx={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 2 }} />
            )}
            {trainerError && (
              <Typography color="error" variant="body2">
                {trainerError}
              </Typography>
            )}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleTrainerSubmit}>
                {editingTrainerId ? 'Update Trainer' : 'Publish Trainer'}
              </Button>
              {editingTrainerId && (
                <Button variant="text" onClick={resetTrainerForm}>
                  Cancel edit
                </Button>
              )}
            </Stack>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Active Trainer Videos ({trainerWorkouts.length})
          </Typography>
          <Grid container spacing={2}>
            {trainerWorkouts.map((trainer) => (
              <Grid item xs={12} md={6} key={trainer.id}>
                <Card sx={{ height: '100%' }}>
                  {trainer.imageUrl ? (
                    <Box component="img" src={trainer.imageUrl} alt={trainer.name} sx={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ height: 180, display: 'grid', placeItems: 'center', bgcolor: 'rgba(15,23,42,0.04)' }}>
                      <ImageIcon color="disabled" fontSize="large" />
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      {trainer.specialty}
                    </Typography>
                    <Typography variant="h6">{trainer.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {trainer.youtubeLink}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button startIcon={<EditIcon />} onClick={() => handleEditTrainer(trainer)}>
                      Edit
                    </Button>
                    <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteTrainer(trainer.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {trainerWorkouts.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No trainer content yet. Use the form above to add the first link.
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

        {/* Community Events Management */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              Community Treks & Events
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Publish official wellness adventures or review student-hosted requests before they hit the community grid.
            </Typography>

            <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField label="Event title" value={eventForm.title} onChange={handleEventChange('title')} fullWidth />
                <TextField
                  label="Indian location"
                  value={eventForm.location}
                  onChange={handleEventChange('location')}
                  helperText="Mention city + state (India only)"
                  fullWidth
                />
              </Stack>
              <TextField
                label="Share the plan"
                value={eventForm.description}
                onChange={handleEventChange('description')}
                multiline
                minRows={3}
                fullWidth
              />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Event date"
                  type="date"
                  value={eventForm.date}
                  onChange={handleEventChange('date')}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Start time"
                  type="time"
                  value={eventForm.time}
                  onChange={handleEventChange('time')}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Hero image URL"
                  value={eventForm.imageUrl}
                  onChange={handleEventChange('imageUrl')}
                  fullWidth
                />
              </Stack>
              {eventForm.imageUrl && (
                <Box component="img" src={eventForm.imageUrl} alt="Event preview" sx={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 2 }} />
              )}
              {eventError && (
                <Typography color="error" variant="body2">
                  {eventError}
                </Typography>
              )}
              <Stack direction="row" spacing={2}>
                <Button variant="contained" startIcon={<EventAvailableIcon />} onClick={handlePublishEvent}>
                  Publish Event
                </Button>
                <Button variant="text" onClick={resetEventForm}>
                  Clear form
                </Button>
              </Stack>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Pending Event Requests ({pendingEventRequests.length})
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {pendingEventRequests.map((request) => (
                <Grid item xs={12} md={6} key={request.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {request.imageUrl ? (
                      <CardMedia component="img" height="160" image={request.imageUrl} alt={request.title} />
                    ) : (
                      <Box sx={{ height: 160, display: 'grid', placeItems: 'center', bgcolor: 'rgba(15,23,42,0.05)' }}>
                        <ImageIcon color="disabled" />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {request.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {request.description || 'No description provided.'}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip icon={<PlaceIcon />} label={request.location} />
                        <Chip icon={<AccessTimeIcon />} label={`${request.date} • ${request.time}`} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Submitted by {request.submittedBy} on {new Date(request.submittedAt).toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button startIcon={<CheckCircleOutlineIcon />} onClick={() => handleApproveEvent(request.id)}>
                        Approve
                      </Button>
                      <Button color="error" startIcon={<CancelOutlinedIcon />} onClick={() => handleRejectEvent(request.id)}>
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              {pendingEventRequests.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    No event requests are waiting. Student submissions will land here for review.
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Live Events Board ({communityEvents.length})
            </Typography>
            <Grid container spacing={2}>
              {communityEvents.map((event) => (
                <Grid item xs={12} md={4} key={event.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {event.imageUrl ? (
                      <CardMedia component="img" height="160" image={event.imageUrl} alt={event.title} />
                    ) : (
                      <Box sx={{ height: 160, display: 'grid', placeItems: 'center', bgcolor: 'rgba(15,23,42,0.05)' }}>
                        <ImageIcon color="disabled" />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <EventAvailableIcon color="success" />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {event.title}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {event.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip icon={<PlaceIcon />} label={event.location} />
                        <Chip icon={<AccessTimeIcon />} label={`${event.date} • ${event.time}`} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Curated by {event.createdBy}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {communityEvents.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    No live events yet. Publish one above to kick things off.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Mental Health Tips Management */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              Mental Health Micro Tips
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Short nudges appear under the focus timers on the Mental Health page. Keep them concise and actionable.
            </Typography>

            <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <TextField
                label="Tip copy"
                value={tipForm.text}
                onChange={handleTipChange('text')}
                multiline
                minRows={2}
                placeholder="Example: Pair tough study blocks with five mindful breaths before you open the laptop."
              />
              <TextField label="Attribution" value={tipForm.author} onChange={handleTipChange('author')} helperText="Shown publicly" />
              {tipError && (
                <Typography color="error" variant="body2">
                  {tipError}
                </Typography>
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" startIcon={<LightbulbIcon />} onClick={handleTipSubmit}>
                  Publish Tip
                </Button>
                <Button variant="text" onClick={resetTipForm}>
                  Clear
                </Button>
              </Stack>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Live Tips ({mentalTips.length})
            </Typography>
            <Grid container spacing={2}>
              {mentalTips.map((tip) => (
                <Grid item xs={12} md={6} key={tip.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <LightbulbIcon color="warning" />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {tip.author}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {tip.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Added {new Date(tip.createdAt).toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteTip(tip.id)}>
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              {mentalTips.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    No tips yet. Share a quick nudge above.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

      {/* User-reported issues */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            User-Reported Issues
          </Typography>
          {issuesError && (
            <Typography color="error" sx={{ mb: 1 }}>Failed to load issues: {issuesError}</Typography>
          )}
          <List dense>
            {issues.map((iss) => (
              <ListItem key={iss.id} alignItems="flex-start">
                <ListItemText
                  primary={`${iss.title} — by ${iss.username || 'unknown'}`}
                  secondary={`${iss.details}  (status: ${iss.status}, at: ${iss.created_at})`}
                />
              </ListItem>
            ))}
            {issues.length === 0 && !issuesError && (
              <Typography variant="body2" color="text.secondary">No issues reported yet.</Typography>
            )}
          </List>
        </CardContent>
      </Card>

    </Container>
  );
};

export default AdminDashboard;