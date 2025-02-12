import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardData = () => apiClient.get('/dashboard');