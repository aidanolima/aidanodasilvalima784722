import api from '../api/axiosInstance';
// Usamos o 'import type' para satisfazer a regra 'verbatimModuleSyntax' do Netlify
import type { AuthResponse } from '../types';

interface LoginCredentials {
  username: string; 
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // 1. Chamada para o endpoint de autenticação
    const response = await api.post('/autenticacao/login', credentials);
    
    // Log de depuração (útil para homologação, remover em produção real)
    console.log('🔍 RESPOSTA COMPLETA DO LOGIN:', response); 

    const dados = response.data;

    // 2. Extração resiliente do token (suporta múltiplos formatos de API)
    const token = dados?.token || 
                  dados?.accessToken || 
                  dados?.access_token || 
                  (typeof dados === 'string' ? dados : null);
    
    // 3. Validação e Persistência
    if (token) {
        localStorage.setItem('token', token);
        
        // Persistência de metadados se existirem
        if (dados?.refreshToken) {
          localStorage.setItem('refreshToken', dados.refreshToken);
        }

        // Retornamos os dados forçando o tipo AuthResponse para o compilador (Cast Sênior)
        // Isso resolve o erro de 'membro não encontrado' durante o build
        return dados as AuthResponse;
    } else {
        console.error('❌ Token não encontrado na resposta:', dados);
        throw new Error('Erro de Autenticação: O servidor não retornou um token válido.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};