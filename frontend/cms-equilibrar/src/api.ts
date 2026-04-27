import axios from 'axios';

const api = axios.create({
  // Vite proxy will handle routing /api to the backend
  baseURL: '/',
});

// Response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Sesión expirada o no autorizada. Redirigiendo a login...');
      // Clear local storage
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// The AuthContext sets axios.defaults.headers.common['Authorization'] globally.
// We will sync that to our instance just in case.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
