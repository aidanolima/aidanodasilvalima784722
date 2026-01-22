import api from '../api/axiosInstance';
import type { AuthResponse } from '../types';

interface LoginCredentials {
  username: string; // Lembre-se: o swagger pede username, não email
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // 1. Faz a chamada e pega a resposta crua
    const response = await api.post('/autenticacao/login', credentials);
    
    console.log('🔍 RESPOSTA COMPLETA DO LOGIN:', response); 

    // 2. Tenta encontrar o token em TODOS os lugares comuns
    // As vezes vem em data.token, data.accessToken, ou direto no data (se for string)
    const dados = response.data;
    const token = dados?.token || dados?.accessToken || dados?.access_token || (typeof dados === 'string' ? dados : null);
    
    // 3. Verifica se achou
    if (token) {
        console.log('✅ Token encontrado e salvo:', token.substring(0, 15) + '...');
        localStorage.setItem('token', token);
        
        // Se houver refresh token, salva também
        if (dados?.refreshToken) localStorage.setItem('refreshToken', dados.refreshToken);
        
        return dados;
    } else {
        console.error('❌ ERRO CRÍTICO: O campo de token não foi encontrado na resposta!', dados);
        throw new Error('Erro de Autenticação: Token não encontrado na resposta do servidor.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};