import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Header from './components/Ui/Header';
import Login from './pages/Login';
import Register from './pages/Register'; // Register page for new users
import StudentDashboard from './Pages/StudentDashboard'; // corrected casing to match filesystem
import AdminDashboard from './pages/AdminDashboard';
import Fitness from './pages/Fitness';
import MentalHealth from './pages/MentalHealth';
import Community from './pages/Community';
import NotFound from './pages/NotFound';

// Private Route Component (Routing & Role-Based Authorization)
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Header />
      <Box component="main" sx={{ mt: 8, p: 3, maxWidth: 1200, margin: '80px auto 0 auto' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/unauthorized" element={<Typography>You are not authorized to view this page.</Typography>} />

          {/* Protected Student Routes */}
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
          <Route path="/fitness" element={<PrivateRoute allowedRoles={['student']}><Fitness /></PrivateRoute>} />
          <Route path="/mental-health" element={<PrivateRoute allowedRoles={['student']}><MentalHealth /></PrivateRoute>} />
          <Route path="/community" element={<PrivateRoute allowedRoles={['student', 'admin']}><Community /></PrivateRoute>} />

          {/* Protected Admin Route */}
          <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;