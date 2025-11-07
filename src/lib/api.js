import axios from 'axios';

// Reads token from localStorage wellnessUser
function getToken() {
  try {
    const raw = localStorage.getItem('wellnessUser');
    if (!raw) return null;
    const { token } = JSON.parse(raw);
    return token || null;
  } catch {
    return null;
  }
}

const api = axios.create({
  baseURL: '/', // Vite proxy will forward /api/* to backend; we call api endpoints with '/api/...'
  withCredentials: false,
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

// Optionally handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // If unauthorized, let callers handle it or log
    return Promise.reject(error);
  }
);

export default api;
