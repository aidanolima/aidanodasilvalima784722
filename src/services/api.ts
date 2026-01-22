import axios from 'axios';

const api = axios.create({
  // URL base da sua API
  baseURL: 'https://pet-manager-api.geia.vip',
});

// Interceptor para adicionar o token em cada chamada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;