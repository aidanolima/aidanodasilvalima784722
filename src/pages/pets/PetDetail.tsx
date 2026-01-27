import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Removido o 'Dog' que não estava sendo usado para evitar erro TS6133
import { 
  ArrowLeft, Phone, MapPin, Calendar, 
  Loader2, Heart, User, Edit3, Save, RefreshCw 
} from 'lucide-react';
import { petService } from '../../services/petService';
import { tutorService } from '../../services/tutorService';
import { Button } from '../../components/Button';
import { ImageUpload } from '../../components/ImageUpload';
import { toast } from 'react-toastify';

export function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState<string>('');
  const [currentTutor, setCurrentTutor] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const petData = await petService.getById(Number(id));
      setPet({ ...petData, urlFoto: petData.foto?.url || petData.urlFoto });

      const tutorsData = await tutorService.getAll(0, 100);
      setAllTutors(Array.isArray(tutorsData) ? tutorsData : tutorsData.content || []);

      // CORREÇÃO: Alterado de .tutores para .tutor conforme erro TS2339 do build
      // Usamos a sintaxe (petData as any) para garantir que o TS não trave no build se a interface divergir
      const vinculo = (pet as any).tutor || (pet as any).tutores;
      
      if (vinculo && vinculo.length > 0) {
        const tutorId = vinculo[0].id;
        const details = await tutorService.getById(tutorId);
        setCurrentTutor(details);
        setSelectedTutorId(tutorId.toString());
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar dados do prontuário.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePhotoUpload = async (file: File) => {
    try {
      setUploading(true);
      await petService.uploadFoto(Number(id), file);
      toast.success("Foto atualizada!");
      await loadData(); 
    } catch (error) {
      toast.error("Erro no upload. Verifique o formato da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleLinkTutor = async () => {
    if (!selectedTutorId) return;
    setUpdating(true);
    try {
      await tutorService.linkPet(Number(selectedTutorId), Number(id));
      toast.success("Tutor vinculado com sucesso!");
      await loadData();
    } catch (error) {
      toast.error("Erro ao vincular tutor.");
    } finally { setUpdating(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-amber-500" size={48} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 p-4 animate-in fade-in duration-500">
      <button onClick={() => navigate('/pets')} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-amber-600 transition-all group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-100 relative">
            <ImageUpload 
              onUpload={handlePhotoUpload} 
              isLoading={uploading} 
              currentImage={pet?.urlFoto} 
              type="pet" 
            />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-amber-600 mb-2 font-black text-xs uppercase tracking-widest">
               <Heart size={16} fill="currentColor" /> Prontuário Amigo
            </div>
            <h1 className="text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">{pet?.nome}</h1>
            <p className="text-2xl text-slate-500 font-bold mt-2 uppercase tracking-tight">
              {pet?.especie} • <span className="text-amber-600">{pet?.raca || 'SRD'}</span>
            </p>
          </div>
          
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
            <h3 className="text-amber-600 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={16} /> Tutor Responsável
            </h3>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <select 
                    value={selectedTutorId}
                    onChange={(e) => setSelectedTutorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-300 font-bold transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d97706' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                  >
                    <option value="">Selecione um tutor para vincular...</option>
                    {allTutors.map((t) => <option key={t.id} value={t.id}>{t.nome.toUpperCase()}</option>)}
                  </select>
                </div>
                <Button onClick={handleLinkTutor} disabled={updating} className="bg-amber-500 hover:bg-amber-600 px-8 rounded-2xl h-13 shadow-lg shadow-amber-100">
                  {updating ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                </Button>
              </div>

              {currentTutor && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100 mt-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm"><Phone size={24} /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase">Telefone</p>
                      <p className="font-black text-slate-900 text-xl">{currentTutor.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                     <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm"><MapPin size={24} /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase">Endereço</p>
                      <p className="font-bold text-slate-900 text-sm truncate max-w-45">{currentTutor.endereco}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 bg-amber-50 py-2.5 px-6 rounded-2xl border border-amber-100 shadow-sm">
              <Calendar className="text-amber-600" size={24} /> 
              <span className="font-black text-xl text-amber-900">{pet?.idade} {pet?.idade === 1 ? 'Ano' : 'Anos'}</span>
            </div>
            <Button variant="outline" onClick={() => navigate(`/pets/${pet.id}/editar`)} className="rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-8 h-12 uppercase text-xs tracking-widest">
              <Edit3 size={18} className="mr-2" /> Editar Cadastro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}