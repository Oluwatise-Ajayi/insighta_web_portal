import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    'X-API-Version': '1',
  },
});

// Response interceptor to handle CSRF tokens from the backend
api.interceptors.response.use(
  (response) => {
    // If the response sets a new CSRF token in a header, we could intercept it here if needed
    return response;
  },
  async (error) => {
    // Check if error is due to session expiration (401)
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        // Attempt to refresh token using the HTTP-only refresh cookie
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        await axios.post(`${backendUrl}/auth/token/refresh`, {}, { withCredentials: true });
        // If successful, retry the original request
        return api(error.config);
      } catch (refreshError) {
        // If refresh fails, session is truly dead
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
