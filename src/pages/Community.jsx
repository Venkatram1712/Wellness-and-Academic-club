import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import BugReportIcon from '@mui/icons-material/BugReport';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useDispatch, useSelector } from 'react-redux';
import api from '../lib/api';
import { requestEvent, addDiscussionMessage } from '../Redux/communitySlice';
import { addIssue } from '../Redux/issuesSlice';

const emptyEventRequest = {
  title: '',
  location: '',
  date: '',
  time: '',
  imageUrl: '',
  description: '',
};

const Community = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.user);
  const events = useSelector((s) => s.community.events);
  const pendingRequestsCount = useSelector((s) => s.community.pendingRequests.length);
  const discussions = useSelector((s) => s.community.discussions);

  const displayName = user?.displayName || user?.name || user?.username || 'Student Host';
  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => {
        const first = new Date(`${a.date || ''}T${a.time || '00:00'}`);
        const second = new Date(`${b.date || ''}T${b.time || '00:00'}`);
        return first - second;
      }),
    [events]
  );
  const discussionList = useMemo(() => Object.values(discussions || {}), [discussions]);
  const [activeTopic, setActiveTopic] = useState(discussionList[0]?.id || '');

  useEffect(() => {
    if (!discussionList.length) return;
    if (!discussionList.find((topic) => topic.id === activeTopic)) {
      setActiveTopic(discussionList[0].id);
    }
  }, [discussionList, activeTopic]);

  const [eventForm, setEventForm] = useState(emptyEventRequest);
  const [eventStatus, setEventStatus] = useState({ success: '', error: '' });
  const [messageInput, setMessageInput] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [issueSuccess, setIssueSuccess] = useState('');
  const [issueError, setIssueError] = useState('');

  const handleEventChange = (field) => (event) => {
    const { value } = event.target;
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    setEventStatus({ success: '', error: '' });
    if (!eventForm.title || !eventForm.location || !eventForm.date || !eventForm.time || !eventForm.imageUrl) {
      setEventStatus({ success: '', error: 'Please fill title, Indian location, date, time, and an image URL.' });
      return;
    }
    dispatch(
      requestEvent({
        ...eventForm,
        submittedBy: displayName,
      })
    );
    setEventStatus({
      success: 'Thanks! Your event is now with admins for approval.',
      error: '',
    });
    setEventForm(emptyEventRequest);
  };

  const activeDiscussion = activeTopic ? discussions[activeTopic] : null;

  const handleDiscussionSubmit = (e) => {
    e.preventDefault();
    setMessageStatus('');
    if (!messageInput.trim()) {
      setMessageStatus('Share a quick thought before posting.');
      return;
    }
    dispatch(
      addDiscussionMessage({
        topicId: activeTopic,
        author: displayName,
        content: messageInput.trim(),
      })
    );
    setMessageInput('');
    setMessageStatus('Shared with the circle ✨');
  };

  const formatEventDateTag = (date, time) => {
    if (!date) return 'TBA';
    try {
      return new Date(`${date}T${time || '00:00'}`).toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return `${date} ${time || ''}`;
    }
  };

  const submitIssue = async (e) => {
    e.preventDefault();
    setIssueSuccess('');
    setIssueError('');
    if (!issueTitle || !issueDetails) {
      setIssueError('Please provide both title and details.');
      return;
    }
    try {
      const response = await api.post('/api/issues', { title: issueTitle, details: issueDetails });
      const persistedIssue =
        response?.data?.issue || {
          id: Date.now(),
          title: issueTitle,
          details: issueDetails,
          status: 'submitted',
          created_at: new Date().toISOString(),
          username: displayName,
        };
      dispatch(addIssue(persistedIssue));
      setIssueSuccess('Thanks! Your report has been submitted.');
      setIssueTitle('');
      setIssueDetails('');
    } catch (err) {
      console.error('Issue submission failed, storing locally', err);
      const localIssue = {
        id: Date.now(),
        title: issueTitle,
        details: issueDetails,
        status: 'pending-sync',
        created_at: new Date().toISOString(),
        username: displayName,
      };
      dispatch(addIssue(localIssue));
      setIssueError('Backend unavailable, stored locally and visible to admins.');
      setIssueTitle('');
      setIssueDetails('');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Stack spacing={4}>
        <Card sx={{ p: { xs: 3, md: 4 } }}>
          <CardContent>
            <Typography variant="h3" gutterBottom color="primary">
              🤝 Community & Field Events
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Trek, run, or journal with peers. Admin-approved itineraries keep everything safe, Indian-locale specific, and inclusive.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admins can push events directly and review {pendingRequestsCount} student host requests waiting in their dashboard.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                Upcoming Community Events
              </Typography>
              <Chip label="Curated in India" color="success" variant="outlined" />
            </Stack>
            <Grid container spacing={3}>
              {sortedEvents.map((event) => (
                <Grid item xs={12} md={4} key={event.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {event.imageUrl && <CardMedia component="img" height="180" image={event.imageUrl} alt={event.title} />}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EventAvailableIcon color="success" />
                        <Typography variant="subtitle1" fontWeight={700}>
                          {event.title}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip icon={<PlaceIcon />} label={event.location} />
                        <Chip icon={<AccessTimeIcon />} label={formatEventDateTag(event.date, event.time)} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Curated by {event.createdBy}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {sortedEvents.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    No field events yet. Check back soon or submit one below.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Host an Event (Student Request)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Submit treks, marathons, yoga pop-ups or volunteering drives anywhere in India. Admins vet safety details before listing.
                </Typography>
                <Box component="form" onSubmit={handleEventSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Event title" value={eventForm.title} onChange={handleEventChange('title')} required />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Location (City, State)"
                      value={eventForm.location}
                      onChange={handleEventChange('location')}
                      helperText="Stick to Indian locations only"
                      required
                      fullWidth
                    />
                    <TextField label="Image URL" value={eventForm.imageUrl} onChange={handleEventChange('imageUrl')} required fullWidth />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="Event date" type="date" value={eventForm.date} onChange={handleEventChange('date')} InputLabelProps={{ shrink: true }} required fullWidth />
                    <TextField label="Start time" type="time" value={eventForm.time} onChange={handleEventChange('time')} InputLabelProps={{ shrink: true }} required fullWidth />
                  </Stack>
                  <TextField
                    label="Describe the plan"
                    value={eventForm.description}
                    onChange={handleEventChange('description')}
                    multiline
                    minRows={3}
                    placeholder="Logistics, difficulty level, support numbers, etc."
                  />
                  {eventStatus.error && <Alert severity="error">{eventStatus.error}</Alert>}
                  {eventStatus.success && <Alert severity="success">{eventStatus.success}</Alert>}
                  <Button variant="contained" type="submit">
                    Send Request to Admin
                  </Button>
                  {!isAuthenticated && (
                    <Typography variant="caption" color="text.secondary">
                      Tip: login so admins can reach you faster.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>
                What happens next?
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <EventAvailableIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Admins verify safety plan, mentors, and medical support." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GroupIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Approved events land on this grid + Student Dashboard feed." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SupportAgentIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary="You get a ping on approval / if more details are needed." />
                </ListItem>
              </List>
              <Typography variant="caption" color="text.secondary">
                Pending approvals currently: {pendingRequestsCount}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                Discussion Boards
              </Typography>
              <Chip icon={<ForumIcon />} label="Mental & Physical Health Threads" color="secondary" variant="outlined" />
            </Stack>
            <Tabs
              value={activeTopic}
              onChange={(_, value) => setActiveTopic(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3 }}
            >
              {discussionList.map((topic) => (
                <Tab
                  key={topic.id}
                  value={topic.id}
                  label={
                    <Stack spacing={0.5} alignItems="flex-start">
                      <Typography variant="body1" fontWeight={600}>
                        {topic.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {topic.tag}
                      </Typography>
                    </Stack>
                  }
                />
              ))}
            </Tabs>
            {activeDiscussion ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Stack spacing={2}>
                    {activeDiscussion.messages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: '1px solid rgba(15,23,42,0.08)',
                          bgcolor: 'background.default',
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          {message.author}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {message.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.timestamp).toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                    ))}
                    {activeDiscussion.messages.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No messages yet. Start the conversation below.
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Paper sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Share with the circle
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Topic focus: {activeDiscussion.description}
                    </Typography>
                    <Box component="form" onSubmit={handleDiscussionSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Drop your thought"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        multiline
                        minRows={3}
                        placeholder="Share coping tips, hydration hacks, or mindful wins."
                      />
                      {messageStatus && (
                        <Typography variant="caption" color="text.secondary">
                          {messageStatus}
                        </Typography>
                      )}
                      <Button variant="contained" type="submit">
                        Post to {activeDiscussion.title}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Discussion topics will appear once admins seed them.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Support & Issue Desk
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Technical snag? Mental health flag? Raise it privately — admins and counsellors track every note.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ChatIcon color="info" />
                    </ListItemIcon>
                    <ListItemText primary="Topic-specific discussion rooms (Exam Stress, Fitness Tips, Nutrition)." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GroupIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Peer moderators available 9am – 11pm IST." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SupportAgentIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Direct line to campus wellness office & national helplines." />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box component="form" onSubmit={submitIssue} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {issueSuccess && <Alert severity="success">{issueSuccess}</Alert>}
                  {issueError && <Alert severity="error">{issueError}</Alert>}
                  <TextField label="Title" value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} required />
                  <TextField label="Details" value={issueDetails} onChange={(e) => setIssueDetails(e.target.value)} multiline minRows={3} required />
                  <Button type="submit" variant="contained" startIcon={<BugReportIcon />} disabled={!isAuthenticated} title={!isAuthenticated ? 'Please login to submit' : ''}>
                    Submit report
                  </Button>
                  {!isAuthenticated && (
                    <Typography variant="caption" color="text.secondary">
                      You need to be logged in to submit a report.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default Community;