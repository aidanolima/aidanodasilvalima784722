import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Plus, Loader2, UserCircle } from 'lucide-react';
import { tutorService } from '../../services/tutorService';
import { TutorCard } from '../../components/TutorCard';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';
import type { Tutor } from '../../types';

export function TutorList() {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ESTADOS PARA PAGINAÇÃO (SINCRONIZADO COM PETLIST) ---
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Função de busca memorizada para evitar loops
  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tutorService.getAll(currentPage, pageSize, searchTerm.trim());
      
      const list = data.content || (Array.isArray(data) ? data : []);
      setTutors(list);
      
      // Cálculo de páginas baseado no retorno da API (Priorizando 'total' ou 'totalElements')
      const total = (data as any).total || data.totalElements || list.length;
      setTotalPages(Math.ceil(total / pageSize) || 1);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar a lista de tutores.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, pageSize]);

  // CORREÇÃO: Mesma lógica de filtro local aplicada em Pets (Garante busca funcional)
  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => 
      tutor.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tutors, searchTerm]);

  // Vigia mudanças de página e busca com debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTutors();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTutors]);

  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const executeDelete = async () => {
    if (itemToDelete === null) return;
    setIsDeleting(true);
    try {
      await tutorService.delete(itemToDelete);
      toast.success('Tutor removido com sucesso!');
      await fetchTutors();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erro ao remover tutor. Verifique se ele possui pets vinculados.');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reinicia para a página 1 ao pesquisar
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tutores Cadastrados</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Gestão de proprietários e contatos</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Button 
            className="bg-slate-900 hover:bg-black rounded-2xl h-12 px-6"
            onClick={() => navigate('/tutores/novo')}
          >
            <Plus size={18} /> Novo Tutor
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Sincronizando dados...</p>
        </div>
      ) : filteredTutors.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <UserCircle className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold uppercase text-sm">
            {searchTerm ? `Nenhum tutor localizado para "${searchTerm}"` : "Nenhum tutor cadastrado"}
          </p>
        </div>
      ) : (
        <>
          {/* GRID SINCRONIZADO: Igual ao PetList (4 colunas em telas XL) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutors.map((tutor) => (
              <TutorCard 
  key={tutor.id} 
  tutor={tutor} 
  onEdit={(id) => navigate(`/tutores/${id}/editar`)} 
  onDelete={confirmDelete} 
  onView={(id) => navigate(`/tutores/${id}`)} // ESSA LINHA ATIVA O CLIQUE NO CORPO
/>
            ))}
          </div>

          {/* PAGINAÇÃO SINCRONIZADA */}
          {totalPages > 1 && (
            <div className="pt-8 flex justify-center">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Excluir Tutor"
        message="Deseja realmente remover este tutor? Esta ação pode ser bloqueada se houver pets vinculados sob sua responsabilidade."
        onConfirm={executeDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}