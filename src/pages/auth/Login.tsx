import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PawPrint } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Executa o Login
      await authService.login({
        username: formData.username, 
        password: formData.password  
      });
      
      // 2. Sucesso
      toast.success('Login realizado com sucesso! Bem-vindo.');
      navigate('/dashboard'); 

    } catch (error: any) {
      console.error('Erro detalhado no login:', error);
      
      // 3. Tratamento de Erro Especializado (Resolve o "vácuo" de informação)
      const status = error.response?.status;
      
      if (status === 401 || status === 403) {
        // Erro específico de usuário/senha
        toast.error('Usuário ou senha incorretos. Tente novamente.');
      } else if (error.code === 'ERR_NETWORK') {
        // Erro de conexão/internet/API fora do ar
        toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        // Fallback para mensagem do backend ou genérica
        const mensagemFallback = error.response?.data?.message || 'Ocorreu um erro inesperado. Tente mais tarde.';
        toast.error(mensagemFallback);
      }
      
    } finally {
      // 4. Libera a interface
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2">
            <PawPrint size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Acesse o Sistema PetAdminGov</h1>
          <p className="text-slate-500">Gerencie pets e tutores em um só lugar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Usuário" 
            name="username" 
            type="text"     
            placeholder="Ex: admin"
            value={formData.username}
            onChange={handleChange}
            required
            autoFocus
            disabled={loading} // Bloqueia edição durante o load
          />
          
          <Input 
            label="Senha"
            name="password" 
            type="password"
            placeholder="••••••"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading} // Bloqueia edição durante o load
          />

          <Button 
            type="submit" 
            className="w-full mt-2" 
            isLoading={loading}
            disabled={loading} // Evita duplo clique
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Versão 2.0 Sênior &copy; 2026 PetAdminGov - By Áidano Lima
        </div>
      </div>
    </div>
  );
}