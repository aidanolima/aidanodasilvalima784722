import { UserCircle, Phone, Pencil, Trash2, ChevronRight, Hash } from 'lucide-react';
import type { Tutor } from '../types';

interface TutorCardProps {
  tutor: Tutor;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export function TutorCard({ tutor, onEdit, onDelete, onView }: TutorCardProps) {
  const tutorPhoto = tutor.foto?.url || tutor.urlFoto;

  return (
    <div 
      onClick={() => onView(tutor.id)}
      className="group bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative flex flex-col h-full"
    >
      {/* ID: POSICIONADO NO TOPO ESQUERDO */}
      <div className="absolute top-8 left-8 z-10 flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-md border border-slate-100 rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
        <Hash size={10} className="opacity-50" />
        <span className="text-[10px] font-black tracking-widest">{tutor.id}</span>
      </div>

      {/* ÁREA DA FOTO */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-6 shrink-0">
        {tutorPhoto ? (
          <img 
            src={tutorPhoto} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt={tutor.nome} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <UserCircle size={80} strokeWidth={1} />
          </div>
        )}
        
        {/* OVERLAY DE AÇÕES (HOVER) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(tutor.id); }} 
            className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl cursor-pointer"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(tutor.id); }} 
            className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* INFORMAÇÕES DO TUTOR */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="max-w-[85%]">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter truncate group-hover:text-blue-600 transition-colors">
              {tutor.nome}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Phone size={12} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                {tutor.telefone}
              </span>
            </div>
          </div>
          <div className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all bg-slate-50 p-2 rounded-full">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      {/* RODAPÉ DO CARD LIMPO */}
      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Visualizar Prontuário
        </span>
      </div>
    </div>
  );
}