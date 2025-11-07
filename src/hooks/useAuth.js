import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, logout } from '../Redux/userSlice';
import api from '../lib/api';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, role } = useSelector((state) => state.user);

  const login = async (username, password) => {
    // Try backend first
    try {
      const res = await api.post('/api/login', { username, password });
      const { token, user } = res.data;
      dispatch(setCredentials({ user, role: user.role, token }));
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
      return;
    } catch (e) {
      console.warn('Backend login failed, falling back to local mock:', e?.response?.data || e.message);
    }

    // Fallback mock for offline dev
    let mockRole = '';
    if (username === 'admin' && password === 'admin') mockRole = 'admin';
    else if (username === 'student' && password === 'student') mockRole = 'student';
    else return alert("Invalid credentials. Register first or use 'student'/'student' or 'admin'/'admin'.");

    const userData = { user: { id: 1, name: username, email: `${username}@uni.edu` }, role: mockRole };
    dispatch(setCredentials(userData));
    if (mockRole === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return { isAuthenticated, user, role, login, logout: handleLogout };
};

export default useAuth;