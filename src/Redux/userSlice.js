import { createSlice } from '@reduxjs/toolkit';

const safeString = (value) => (typeof value === 'string' ? value.trim() : '');

const deriveDisplayName = (user = {}) => {
  const fullFromParts = [safeString(user.firstName), safeString(user.lastName)].filter(Boolean).join(' ');
  const emailValue = safeString(user.email);
  const emailHandle = emailValue ? emailValue.split('@')[0] : '';
  const candidates = [
    safeString(user.displayName),
    safeString(user.fullName),
    fullFromParts,
    safeString(user.name),
    safeString(user.username),
    emailHandle,
  ];
  const match = candidates.find((candidate) => candidate && candidate.length > 0);
  return match || 'Student';
};

const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') return null;
  const displayName = deriveDisplayName(user);
  return { ...user, displayName };
};

// Function to get initial state from Local Storage
const getInitialUserState = () => {
  try {
    const storedUser = localStorage.getItem('wellnessUser');
    if (storedUser) {
      const { user, role, token } = JSON.parse(storedUser);
      const normalizedUser = normalizeUser(user);
      if (normalizedUser) {
        return { isAuthenticated: true, user: normalizedUser, role, token };
      }
    }
  } catch (e) {
    console.error('Error reading user from localStorage', e);
  }
  return { isAuthenticated: false, user: null, role: null, token: null };
};

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialUserState(),
  reducers: {
    // Reducer to set user data upon successful login
    setCredentials: (state, action) => {
      const { user, role, token = null } = action.payload;
      const normalizedUser = normalizeUser(user);
      state.isAuthenticated = Boolean(normalizedUser);
      state.user = normalizedUser;
      state.role = role;
      state.token = token;
      // Persist to Local Storage
      localStorage.setItem('wellnessUser', JSON.stringify({ user: normalizedUser, role, token }));
    },
    // Reducer to clear user data upon logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = null;
      localStorage.removeItem('wellnessUser');
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;