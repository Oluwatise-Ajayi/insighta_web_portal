import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  withCredentials: true, // Required for sending/receiving HTTP-only cookies
  headers: {
    'X-API-Version': '1',
  },
});

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        // FIX: correct endpoint is /auth/refresh not /auth/token/refresh
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        await axios.post(`${backendUrl}/auth/refresh`, {}, { withCredentials: true });
        // Retry original request with refreshed cookie
        return api(error.config);
      } catch (refreshError) {
        // Refresh failed — send to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;