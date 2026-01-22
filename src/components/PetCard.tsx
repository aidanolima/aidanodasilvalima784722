import { Dog, Calendar, Pencil, Trash2, ChevronRight } from 'lucide-react';
import type { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PetCard({ pet, onEdit, onDelete }: PetCardProps) {
  // Função para navegar para detalhes (clique no corpo do card)
  const handleCardClick = () => {
    onEdit(pet.id);
  };

  // Funções para ações rápidas (clique nos botões da imagem)
  // O e.stopPropagation() é CRUCIAL aqui para não disparar o handleCardClick junto
  const handleQuickEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(pet.id);
  };

  const handleQuickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(pet.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative flex flex-col h-full"
    >
      {/* --- ZONA 1: FOTO & AÇÕES RÁPIDAS --- */}
      <div className="relative aspect-square rounded-4xl overflow-hidden bg-slate-50 mb-6 shrink-0">
        {pet.urlFoto ? (
          <img 
            src={pet.urlFoto} 
            alt={pet.nome} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Dog size={64} strokeWidth={1.5} />
          </div>
        )}
        
        {/* Overlay de Ações Rápidas (Aparece no Hover da IMAGEM) */}
        {/* Adicionamos 'group/image' para que o hover seja específico desta área */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] group/image">
          <button
            onClick={handleQuickEdit}
            className="p-3 bg-white text-slate-700 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:scale-110 active:scale-95"
            title="Edição Rápida"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={handleQuickDelete}
            className="p-3 bg-white text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg hover:scale-110 active:scale-95"
            title="Excluir Pet"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* --- ZONA 2: CORPO DO CARD (DETALHES) --- */}
      <div className="flex flex-col flex-1 justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="max-w-[85%]">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter truncate group-hover:text-blue-600 transition-colors">
                {pet.nome}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                {pet.especie} • <span className="text-blue-600">{pet.raca || 'SRD'}</span>
              </p>
            </div>
            
            {/* NOVO ÍCONE INDICATIVO DE NAVEGAÇÃO */}
            {/* Ele se move ligeiramente para a direita e fica azul quando passa o mouse no CARD */}
            <div className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300 bg-slate-50 p-2 rounded-full mt-1">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-blue-100 transition-colors">
            <Calendar size={16} className="text-blue-500" />
            <span className="text-xs font-bold text-slate-700">{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}