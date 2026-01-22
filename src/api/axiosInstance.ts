import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor de REQUISIÇÃO (Já existia: coloca o token na ida)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // console.log('🔑 Anexando Token:', config.url); // Comentei para limpar o console
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de RESPOSTA (NOVO: monitora erros na volta)
api.interceptors.response.use(
  (response) => {
    // Se deu certo, só passa o dado para frente
    return response;
  },
  (error) => {
    // Se der erro, verificamos se é 401 (Token inválido/expirado)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('⛔ Sessão expirada. Redirecionando para login...');
      
      // Limpa o token velho
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Força o redirecionamento para o login
      // Usamos window.location.href para garantir que o React limpe tudo
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;