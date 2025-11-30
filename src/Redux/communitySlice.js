import { createSlice, nanoid } from '@reduxjs/toolkit';
import { loadCommunityState, saveCommunityState } from '../lib/communityStorage';

const seedEvents = [
  {
    id: nanoid(),
    title: 'Rajmachi Midnight Trek',
    description: 'Sunrise hike with student fitness club guides, complete with campfire journaling.',
    location: 'Rajmachi Fort, Lonavla, Maharashtra',
    date: '2025-12-06',
    time: '21:30',
    imageUrl: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80',
    createdBy: 'Campus Admin',
    approvedAt: new Date().toISOString(),
  },
  {
    id: nanoid(),
    title: 'Hyderabad Lakeside Marathon',
    description: '10K run around Hussain Sagar with hydration pods every 2 km.',
    location: "People's Plaza, Hyderabad, Telangana",
    date: '2026-01-12',
    time: '06:00',
    imageUrl: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80',
    createdBy: 'Campus Admin',
    approvedAt: new Date().toISOString(),
  },
  {
    id: nanoid(),
    title: 'Nandi Hills Sunrise Ride',
    description: 'Cycling + yoga cooldown to reset screens-overload bodies.',
    location: 'Nandi Hills, Bengaluru, Karnataka',
    date: '2025-12-20',
    time: '04:45',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
    createdBy: 'Campus Admin',
    approvedAt: new Date().toISOString(),
  },
];

const seedDiscussions = {
  mentalWellness: {
    id: 'mentalWellness',
    title: 'Mindful Breathers Circle',
    tag: 'Mental Health',
    description: 'Talk journaling cues, mindful breaks, and SOS resources when the semester spikes.',
    messages: [
      {
        id: nanoid(),
        author: 'Counsellor Diya',
        content: 'Stack your day with 5-minute breath ladders before every lecture block. It changes the tone.',
        timestamp: new Date().toISOString(),
      },
      {
        id: nanoid(),
        author: 'Rhea (ECE)',
        content: 'Grounding playlists + balcony sunlight keeps my anxiety from spiralling before vivas.',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  enduranceCrew: {
    id: 'enduranceCrew',
    title: 'Endurance Crew',
    tag: 'Physical Health',
    description: 'Marathon prep, trek hydration plans, and accountability check-ins.',
    messages: [
      {
        id: nanoid(),
        author: 'Coach Imran',
        content: 'Alternate long LSD runs with strength days. Knees will thank you in Bengaluru elevation.',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  nutritionNook: {
    id: 'nutritionNook',
    title: 'Nutrition Nook',
    tag: 'Food & Recovery',
    description: 'Share dorm-friendly recipes and campus mess hacks that actually taste good.',
    messages: [
      {
        id: nanoid(),
        author: 'Ananya',
        content: 'Switching to millets before night labs kept me awake without jittery coffee crashes.',
        timestamp: new Date().toISOString(),
      },
    ],
  },
};

const persistedState = loadCommunityState();

const initialState =
  persistedState ?? {
    events: seedEvents,
    pendingRequests: [],
    discussions: seedDiscussions,
  };

const persist = (state) => {
  saveCommunityState({
    events: state.events,
    pendingRequests: state.pendingRequests,
    discussions: state.discussions,
  });
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    addEvent: {
      reducer(state, action) {
        state.events.unshift(action.payload);
        persist(state);
      },
      prepare(event) {
        return {
          payload: {
            id: event.id ?? nanoid(),
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date,
            time: event.time,
            imageUrl: event.imageUrl,
            createdBy: event.createdBy || 'Campus Admin',
            approvedAt: new Date().toISOString(),
          },
        };
      },
    },
    requestEvent: {
      reducer(state, action) {
        state.pendingRequests.unshift(action.payload);
        persist(state);
      },
      prepare(request) {
        return {
          payload: {
            id: nanoid(),
            title: request.title,
            description: request.description,
            location: request.location,
            date: request.date,
            time: request.time,
            imageUrl: request.imageUrl,
            submittedBy: request.submittedBy || 'Student Host',
            submittedAt: new Date().toISOString(),
            status: 'pending',
          },
        };
      },
    },
    approveEvent(state, action) {
      const idx = state.pendingRequests.findIndex((evt) => evt.id === action.payload);
      if (idx === -1) return;
      const [request] = state.pendingRequests.splice(idx, 1);
      state.events.unshift({
        id: request.id,
        title: request.title,
        description: request.description,
        location: request.location,
        date: request.date,
        time: request.time,
        imageUrl: request.imageUrl,
        createdBy: request.submittedBy,
        approvedAt: new Date().toISOString(),
      });
      persist(state);
    },
    rejectEvent(state, action) {
      const idx = state.pendingRequests.findIndex((evt) => evt.id === action.payload);
      if (idx === -1) return;
      state.pendingRequests.splice(idx, 1);
      persist(state);
    },
    addDiscussionMessage: {
      reducer(state, action) {
        const { topicId, message } = action.payload;
        if (!state.discussions[topicId]) return;
        state.discussions[topicId].messages.push(message);
        persist(state);
      },
      prepare({ topicId, author, content }) {
        return {
          payload: {
            topicId,
            message: {
              id: nanoid(),
              author: author || 'Anonymous',
              content,
              timestamp: new Date().toISOString(),
            },
          },
        };
      },
    },
  },
});

export const { addEvent, requestEvent, approveEvent, rejectEvent, addDiscussionMessage } = communitySlice.actions;
export default communitySlice.reducer;
