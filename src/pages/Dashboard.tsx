import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog, Users, PlusCircle, ArrowRight, Loader2, HeartHandshake } from 'lucide-react';
import { petService } from '../services/petService';
import { tutorService } from '../services/tutorService';
import { toast } from 'react-toastify';

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pets: 0,
    tutors: 0,
    linked: 0 
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const [petsData, tutorsData] = await Promise.all([
        petService.getAll(0, 1000), 
        tutorService.getAll(0, 1000)
      ]);

      const tutorsList = (tutorsData as any)?.content || [];
      const totalPets = (petsData as any)?.totalElements || (petsData as any)?.total || 0;
      const totalTutores = (tutorsData as any)?.totalElements || (tutorsData as any)?.total || 0;

      const vinculadosCount = tutorsList.reduce((acc: number, tutor: any) => {
        const listaPets = tutor.pets || tutor.animais || [];
        const quantidade = Array.isArray(listaPets) ? listaPets.length : 0;
        return acc + quantidade;
      }, 0);

      setStats({
        pets: totalPets,
        tutors: totalTutores,
        linked: vinculadosCount
      });

    } catch (error) {
      console.error('Falha ao processar indicadores:', error);
      toast.error("Não foi possível carregar as estatísticas em tempo real.");
    } finally {
      setLoading(false);
    }
  };

  // Componente de Card com suporte a clique (onClick)
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, borderColor, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`
        bg-white p-8 rounded-[2.5rem] shadow-sm border ${borderColor} 
        flex flex-col items-center justify-center text-center gap-4 group 
        transition-all duration-500 hover:shadow-xl hover:-translate-y-1
        ${onClick ? 'cursor-pointer active:scale-95' : ''} 
      `}
    >
      <div className={`w-16 h-16 ${bgClass} rounded-2xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon size={32} />
      </div>
      <div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-1">
          {loading ? <Loader2 className="animate-spin inline" size={24}/> : value}
        </h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-4 animate-in fade-in duration-700">
      
      {/* 1. CABEÇALHO */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
          <Dog size={32} />
        </div>
        <div>
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest leading-none mb-1">Módulo de Gestão</p>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Painel de Controle</h1>
        </div>
      </div>

      {/* 2. CARDS DE ESTATÍSTICAS (NO TOPO AGORA) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card Pets -> Vai para listagem de pets */}
        <StatCard 
          title="Total de Pets" 
          value={stats.pets} 
          icon={Dog} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-50" 
          borderColor="border-blue-100"
          onClick={() => navigate('/pets')} 
        />
        
        {/* Card Tutores -> Vai para listagem de tutores */}
        <StatCard 
          title="Tutores Cadastrados" 
          value={stats.tutors} 
          icon={Users} 
          colorClass="text-emerald-600" 
          bgClass="bg-emerald-50" 
          borderColor="border-emerald-100"
          onClick={() => navigate('/tutores')}
        />
        
        {/* Card Vinculados (Apenas informativo) */}
        <StatCard 
          title="Pets Vinculados" 
          value={stats.linked} 
          icon={HeartHandshake} 
          colorClass="text-purple-600" 
          bgClass="bg-purple-50" 
          borderColor="border-purple-200 border-b-4 border-b-purple-600" 
        />
      </div>

      {/* 3. AÇÕES DO SISTEMA (ABAIXO DOS CARDS) */}
      <div>
        <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6 px-1">Ações do Sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          <button onClick={() => navigate('/pets/novo')} className="flex items-center gap-4 p-6 bg-white rounded-4xl border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all text-left group cursor-pointer">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><PlusCircle size={24} /></div>
            <div>
              <span className="block font-black text-slate-800 uppercase text-xs">Novo Pet</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Adicionar Pets</span>
            </div>
          </button>

          <button onClick={() => navigate('/tutores/novo')} className="flex items-center gap-4 p-6 bg-white rounded-4xl border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all text-left group cursor-pointer">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors"><PlusCircle size={24} /></div>
            <div>
              <span className="block font-black text-slate-800 uppercase text-xs">Novo Tutor</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Adicionar Tutor</span>
            </div>
          </button>

          <button onClick={() => navigate('/pets')} className="flex items-center gap-4 p-6 bg-white rounded-4xl border border-slate-100 hover:shadow-xl hover:border-slate-300 transition-all text-left group cursor-pointer">
            <div className="p-4 bg-slate-50 text-slate-600 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors"><ArrowRight size={24} /></div>
            <div>
              <span className="block font-black text-slate-800 uppercase text-xs">Ver Listagem</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Listagem PETs</span>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
