import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog, Users, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import { petService } from '../services/petService';
import { tutorService } from '../services/tutorService';

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pets: 0,
    tutors: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Busca paralela para performance
      const [petsData, tutorsData] = await Promise.all([
        petService.getAll(0, 1),
        tutorService.getAll(0, 1)
      ]);

      /// Usamos (petsData as any) para o TypeScript aceitar o campo "total"
      setStats({
        pets: (petsData as any)?.total || 0,
        tutors: (tutorsData as any)?.total || 0
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas', error);
    } finally {
      setLoading(false);
    }
  };

  // Componente visual do Card (Centralizado e Bonito)
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center gap-4 group hover:border-${colorClass}-300 transition-all duration-300`}>
      <div className={`w-16 h-16 ${bgClass} rounded-full flex items-center justify-center text-${colorClass}-600 group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon size={32} />
      </div>
      <div>
        <h2 className="text-4xl font-extrabold text-slate-800 mb-1">
          {loading ? <Loader2 className="animate-spin inline" size={24}/> : value}
        </h2>
        <p className="text-slate-500 font-medium">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Painel de Controle</h1>
        <p className="text-slate-500">Visão geral do sistema PetManager</p>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          title="Total de Pets" 
          value={stats.pets} 
          icon={Dog} 
          colorClass="blue" 
          bgClass="bg-blue-100" 
        />
        
        <StatCard 
          title="Tutores Cadastrados" 
          value={stats.tutors} 
          icon={Users} 
          colorClass="green" 
          bgClass="bg-green-100" 
        />
      </div>

      {/* Acesso Rápido */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 px-1">Acesso Rápido</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          <button 
            onClick={() => navigate('/pets/novo')}
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-400 transition-all text-left group"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <PlusCircle size={24} />
            </div>
            <div>
              <span className="block font-bold text-slate-700">Novo Pet</span>
              <span className="text-xs text-slate-400">Adicionar registro</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/tutores/novo')}
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-green-400 transition-all text-left group"
          >
            <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
              <PlusCircle size={24} />
            </div>
            <div>
              <span className="block font-bold text-slate-700">Novo Tutor</span>
              <span className="text-xs text-slate-400">Cadastrar cliente</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/pets')}
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-slate-400 transition-all text-left group"
          >
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <ArrowRight size={24} />
            </div>
            <div>
              <span className="block font-bold text-slate-700">Ver Lista</span>
              <span className="text-xs text-slate-400">Ir para listagem</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}