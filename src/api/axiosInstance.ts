import axios from 'axios';

// Usamos a variável de ambiente se existir, senão usa a URL fixa (Safety Fallback)
const baseURL = import.meta.env.VITE_API_URL || 'https://pet-manager-api.geia.vip';

const api = axios.create({
  baseURL: baseURL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor de REQUISIÇÃO (Preservado)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de RESPOSTA (CORRIGIDO)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // AQUI ESTÁ A CORREÇÃO DO "PISCA"
    // Verificamos se a requisição que falhou foi uma tentativa de login
    const originalRequest = error.config;
    const isLoginRequest = originalRequest?.url?.includes('/login') || originalRequest?.url?.includes('autenticacao');

    // Se der erro 401 ou 403...
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // SÓ executamos o logout forçado se NÃO for uma tentativa de login
      if (!isLoginRequest) {
          console.warn('⛔ Sessão expirada. Redirecionando para login...');
          
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Verificação extra para não recarregar se já estivermos na tela de login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
      }
      // Se FOR login, não fazemos nada aqui. 
      // O erro passará para o 'catch' do Login.tsx, que mostrará o Toast.
    }
    
    return Promise.reject(error);
  }
);

export default api;