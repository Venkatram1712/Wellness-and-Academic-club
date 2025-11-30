import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Slider,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const STORAGE_KEY = 'focus_planner_state_v1';
const DEFAULT_DURATION_SECONDS = 25 * 60;

const loadFocusState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to read focus planner state', error);
    return null;
  }
};

const persistFocusState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist focus planner state', error);
  }
};

const createTimerState = () => ({ remaining: DEFAULT_DURATION_SECONDS, duration: DEFAULT_DURATION_SECONDS, isRunning: false });

const FocusPlanner = () => {
  const tips = useSelector((s) => s.mentalTips.tips);
  const persisted = loadFocusState();
  const [tasks, setTasks] = useState(() => persisted?.tasks || []);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => persisted?.totalFocusMinutes || 0);
  const [newTask, setNewTask] = useState('');
  const [timers, setTimers] = useState(() => {
    const base = {};
    (persisted?.tasks || []).forEach((task) => {
      base[task.id] = createTimerState();
    });
    return base;
  });
  const [swipeValues, setSwipeValues] = useState(() => {
    const base = {};
    (persisted?.tasks || []).forEach((task) => {
      base[task.id] = 0;
    });
    return base;
  });
  const intervalsRef = useRef({});

  useEffect(() => {
    persistFocusState({ tasks, totalFocusMinutes });
  }, [tasks, totalFocusMinutes]);

  useEffect(() => {
    setTimers((prev) => {
      const next = { ...prev };
      tasks.forEach((task) => {
        if (!next[task.id]) {
          next[task.id] = createTimerState();
        }
      });
      Object.keys(next).forEach((taskId) => {
        if (!tasks.find((task) => task.id === taskId)) {
          if (intervalsRef.current[taskId]) {
            clearInterval(intervalsRef.current[taskId]);
            delete intervalsRef.current[taskId];
          }
          delete next[taskId];
        }
      });
      return next;
    });
    setSwipeValues((prev) => {
      const next = { ...prev };
      tasks.forEach((task) => {
        if (typeof next[task.id] === 'undefined') {
          next[task.id] = 0;
        }
      });
      Object.keys(next).forEach((taskId) => {
        if (!tasks.find((task) => task.id === taskId)) {
          delete next[taskId];
        }
      });
      return next;
    });
  }, [tasks]);

  useEffect(() => () => {
    Object.values(intervalsRef.current).forEach((intervalId) => {
      clearInterval(intervalId);
    });
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task = {
      id: nanoid(),
      title: newTask.trim(),
      completed: false,
      focusMinutes: 0,
    };
    setTasks((prev) => [task, ...prev]);
    setNewTask('');
  };

  const toggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const updateFocusAfterSession = (taskId, focusMinutes) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              focusMinutes: task.focusMinutes + focusMinutes,
            }
          : task
      )
    );
    setTotalFocusMinutes((prev) => prev + focusMinutes);
  };

  const handleStartTimer = (taskId) => {
    if (intervalsRef.current[taskId]) return;
    setTimers((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], isRunning: true },
    }));

    intervalsRef.current[taskId] = setInterval(() => {
      setTimers((prev) => {
        const current = prev[taskId];
        if (!current) return prev;
        const nextRemaining = current.remaining - 1;
        if (nextRemaining <= 0) {
          clearInterval(intervalsRef.current[taskId]);
          delete intervalsRef.current[taskId];
          updateFocusAfterSession(taskId, Math.round(current.duration / 60));
          return {
            ...prev,
            [taskId]: { ...current, remaining: current.duration, isRunning: false },
          };
        }
        return {
          ...prev,
          [taskId]: { ...current, remaining: nextRemaining, isRunning: true },
        };
      });
    }, 1000);
  };

  const handlePauseTimer = (taskId) => {
    if (intervalsRef.current[taskId]) {
      clearInterval(intervalsRef.current[taskId]);
      delete intervalsRef.current[taskId];
    }
    setTimers((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], isRunning: false },
    }));
  };

  const handleResetTimer = (taskId) => {
    if (intervalsRef.current[taskId]) {
      clearInterval(intervalsRef.current[taskId]);
      delete intervalsRef.current[taskId];
    }
    setTimers((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], remaining: prev[taskId].duration, isRunning: false },
    }));
  };

  const handleSwipeChange = (taskId, rawValue) => {
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    setSwipeValues((prev) => ({ ...prev, [taskId]: value }));
    if (value >= 100) {
      if (intervalsRef.current[taskId]) {
        clearInterval(intervalsRef.current[taskId]);
        delete intervalsRef.current[taskId];
      }
      const durationMinutes = Math.round((timers[taskId]?.duration || DEFAULT_DURATION_SECONDS) / 60);
      updateFocusAfterSession(taskId, durationMinutes);
      setTimers((prev) => ({
        ...prev,
        [taskId]: { ...prev[taskId], remaining: prev[taskId].duration, isRunning: false },
      }));
      setTimeout(() => {
        setSwipeValues((prev) => ({ ...prev, [taskId]: 0 }));
      }, 200);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const progressForTask = (taskId) => {
    const timer = timers[taskId];
    if (!timer) return 0;
    return ((timer.duration - timer.remaining) / timer.duration) * 100;
  };

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  const tipToHighlight = tips?.[0];

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Focus Sprint Center
              </Typography>
              <Typography color="text.secondary">
                Track Pomodoro bursts, tick off wellness tasks, and keep a running total of deep-focus minutes.
              </Typography>
            </Box>
            <Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
              <Typography variant="caption" color="text.secondary">
                Total focused this week
              </Typography>
              <Typography variant="h4" color="success.main" fontWeight={700}>
                {totalFocusMinutes} min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completedCount}/{tasks.length || 0} tasks completed
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack component="form" onSubmit={addTask} direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              label="Add a mindful to-do"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Example: 25-minute breath-led revision sprint"
              fullWidth
            />
            <Button type="submit" variant="contained" startIcon={<TaskAltIcon />}>
              Add Task
            </Button>
          </Stack>

          <Stack spacing={2}>
            {tasks.map((task) => {
              const timer = timers[task.id] || createTimerState();
              const progress = progressForTask(task.id);
              return (
                <Box
                  key={task.id}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(15,23,42,0.08)',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                    <FormControlLabel
                      control={<Checkbox checked={task.completed} onChange={() => toggleComplete(task.id)} />}
                      label={
                        <Stack>
                          <Typography fontWeight={600}>{task.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Focus logged: {task.focusMinutes} min
                          </Typography>
                        </Stack>
                      }
                    />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip icon={<AccessTimeIcon />} label={formatTime(timer.remaining)} />
                      <IconButton color="success" onClick={() => handleStartTimer(task.id)} disabled={timer.isRunning}>
                        <PlayArrowRoundedIcon />
                      </IconButton>
                      <IconButton onClick={() => handlePauseTimer(task.id)} disabled={!timer.isRunning}>
                        <PauseRoundedIcon />
                      </IconButton>
                      <IconButton onClick={() => handleResetTimer(task.id)}>
                        <RestartAltRoundedIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, borderRadius: 999 }} />
                  <Tooltip title="Swipe fully to manually mark this Pomodoro as done">
                    <Slider
                      value={swipeValues[task.id] || 0}
                      onChange={(_, value) => handleSwipeChange(task.id, value)}
                      min={0}
                      max={100}
                      sx={{ mt: 2 }}
                      valueLabelDisplay="auto"
                      step={10}
                    />
                  </Tooltip>
                </Box>
              );
            })}
            {tasks.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No focus tasks yet. Add one above to start your Pomodoro chain.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              Admin Mental Health Tip
            </Typography>
            {tipToHighlight ? (
              <Typography variant="body2" color="text.secondary">
                “{tipToHighlight.text}” — {tipToHighlight.author}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Admins can drop nudges from the dashboard. Check back soon.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default FocusPlanner;
