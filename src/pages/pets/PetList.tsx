import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Plus, Loader2, Dog } from 'lucide-react';
import { petService } from '../../services/petService';
import { PetCard } from '../../components/PetCard';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';
import type { Pet } from '../../types';

export function PetList() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ESTADOS PARA PAGINAÇÃO (MESMO PADRÃO DO TUTORLIST) ---
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Função de busca memorizada para evitar loops (Sincronizada com TutorList)
  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await petService.getAll(currentPage, pageSize, searchTerm.trim());
      
      const rawList = data.content || (Array.isArray(data) ? data : []);
      
      // Mapeamento para garantir a URL da foto (específico de Pets)
      const formattedList = rawList.map((pet: any) => ({
        ...pet,
        urlFoto: pet.foto?.url || pet.urlFoto 
      }));

      setPets(formattedList);

      // Cálculo de páginas baseado no retorno da API (Mesma lógica do TutorList)
      const total = (data as any).total || data.totalElements || formattedList.length;
      setTotalPages(Math.ceil(total / pageSize) || 1);

    } catch (error) {
      console.error("Erro na busca:", error);
      toast.error('Não foi possível carregar a lista de pets.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, pageSize]);

  // CORREÇÃO: Mesma lógica de filtro local aplicada em Tutores
  const filteredPets = useMemo(() => {
    return pets.filter(pet => 
      pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.raca && pet.raca.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [pets, searchTerm]);

  // Vigia mudanças de página e busca com debounce (Sincronizado)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPets();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPets]);

  const handleEdit = (id: number) => {
    navigate(`/pets/${id}`);
  };

  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const executeDelete = async () => {
    if (itemToDelete === null) return;
    setIsDeleting(true);
    try {
      await petService.delete(itemToDelete);
      toast.success('Pet excluído com sucesso!');
      await fetchPets(); 
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erro ao excluir o pet. Verifique se há vínculos ativos.');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Função para resetar a página ao digitar na busca (Sincronizada)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reinicia para a página 1 ao pesquisar
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Pets Cadastrados</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Gestão e monitoramento de animais</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome ou raça..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <Button onClick={() => navigate('/pets/novo')} className="bg-slate-900 hover:bg-black rounded-2xl h-11.5 px-6">
            <Plus size={18} /> Novo Pet
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Sincronizando dados...</p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <Dog className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold uppercase text-sm">
             {searchTerm ? `Nenhum pet localizado para "${searchTerm}"` : "Nenhum pet cadastrado"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* MAPEAMOS A LISTA FILTRADA LOCALMENTE (IGUAL TUTORES) */}
            {filteredPets.map((pet) => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                onEdit={handleEdit}     
                onDelete={confirmDelete}
              />
            ))}
          </div>

          {/* COMPONENTE DE PAGINAÇÃO (MESMA LÓGICA DO TUTORLIST) */}
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
        title="Excluir Animal"
        message="Deseja realmente remover este registro do sistema? Esta ação removerá também os vínculos com tutores."
        onConfirm={executeDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}