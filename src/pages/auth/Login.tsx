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
      await authService.login({
        username: formData.username, 
        password: formData.password  
      });
      
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard'); 
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // MELHORIA: Tenta pegar a mensagem específica do backend, se houver
      const mensagemErro = error.response?.data?.message || 'Credenciais inválidas ou erro de conexão.';
      toast.error(mensagemErro);
      
    } finally {
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
          <h1 className="text-2xl font-bold text-slate-800">Acesse o Sistema</h1>
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
          />
          
          <Input 
            label="Senha"
            name="password" 
            type="password"
            placeholder="••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button 
            type="submit" 
            className="w-full mt-2" 
            isLoading={loading}
          >
            Entrar
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Versão 1.0.0 &copy; 2026 PetAdmin - By Áidano Lima
        </div>
      </div>
    </div>
  );
}