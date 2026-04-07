import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// If access token expires, try to refresh it automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(original);
      } catch {
        // refresh failed — user needs to log in again
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
