import { createSlice } from '@reduxjs/toolkit';

// Function to get initial state from Local Storage
const getInitialUserState = () => {
  try {
    const storedUser = localStorage.getItem('wellnessUser');
    if (storedUser) {
      const { user, role, token } = JSON.parse(storedUser);
      return { isAuthenticated: true, user, role, token };
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
      state.isAuthenticated = true;
      state.user = user;
      state.role = role;
      state.token = token;
      // Persist to Local Storage
      localStorage.setItem('wellnessUser', JSON.stringify({ user, role, token }));
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