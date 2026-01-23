import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Adicionado Link aqui
import { 
  ArrowLeft, User, Dog, Loader2, Edit3, Heart, 
  Phone, MapPin, Link2, Link2Off, RefreshCw, ExternalLink // Adicionado ExternalLink
} from 'lucide-react';
import { tutorService } from '../../services/tutorService';
import { petService } from '../../services/petService';
import { Button } from '../../components/Button';
import { toast } from 'react-toastify';

export function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [tutor, setTutor] = useState<any>(null);
  const [tutorPets, setTutorPets] = useState<any[]>([]);
  const [allPets, setAllPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const numericId = Number(id);
      
      const [tutorData, linkedPetsData, allPetsData] = await Promise.all([
        tutorService.getById(numericId),
        tutorService.getPetsByTutor(numericId),
        petService.getAll(0, 1000)
      ]);

      setTutor(tutorData);
      setTutorPets(linkedPetsData || []);
      setAllPets(allPetsData.content || []);

      if (linkedPetsData && linkedPetsData.length > 0) {
        setSelectedPetId(linkedPetsData[0].id.toString());
      } else {
        setSelectedPetId('');
      }
    } catch (e) {
      setTutorPets([]); 
      toast.error("Erro na sincronização dos dados.");
    } finally {
      setLoading(false);
    }
    // Mantido apenas o 'id' para evitar o loop de renderização (pisca-pisca)
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLink = async () => {
    if (!selectedPetId) return;
    setUpdating(true);
    try {
      await tutorService.linkPet(Number(id), Number(selectedPetId));
      toast.success("Vínculo processado!");
      await loadData();
    } catch (e) {
      toast.error("Erro ao vincular. Verifique se o animal já possui dono.");
    } finally { setUpdating(false); }
  };

  const handleUnlink = async () => {
    if (!selectedPetId) return;
    setUpdating(true);
    try {
      await tutorService.unlinkPet(Number(id), Number(selectedPetId));
      toast.success("Vínculo removido!");
      setSelectedPetId('');
      await loadData();
    } catch (e) {
      toast.error("Erro ao desvincular.");
    } finally { setUpdating(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 p-4 animate-in fade-in duration-500">
      <button onClick={() => navigate('/tutores')} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-blue-600 transition-all group cursor-pointer">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar para Tutores
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-50 flex items-center justify-center">
            {tutor.foto?.url || tutor.urlFoto ? (
              <img src={tutor.foto?.url || tutor.urlFoto} className="w-full h-full object-cover" alt={tutor.nome} />
            ) : (
              <User size={100} className="text-slate-200" />
            )}
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2 font-black text-xs uppercase tracking-widest">
               <Heart size={16} fill="currentColor" /> Prontuário Digital Senior
            </div>
            <h1 className="text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">{tutor.nome}</h1>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 min-w-55">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Phone size={20} /></div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase">Telefone</p>
                  <p className="text-slate-900 font-black text-lg">{tutor.telefone}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 min-w-70">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><MapPin size={20} /></div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase">Endereço</p>
                  <p className="text-slate-900 font-bold text-sm uppercase">{tutor.endereco}</p>
                </div>
              </div>

              {tutorPets.length > 0 ? (
                tutorPets.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 animate-in zoom-in-95">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Dog size={20} /></div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase">Animal Vinculado</p>
                      <p className="text-slate-900 font-black text-lg uppercase">{p.nome}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 border-dashed flex items-center gap-4 opacity-70">
                  <div className="p-3 bg-white rounded-2xl text-slate-300"><Dog size={20} /></div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-tight">Vínculo</p>
                    <p className="text-slate-400 font-black text-xs uppercase italic">PET SEM VINCULO COM TUTOR</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
            <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Link2 size={16} /> Painel de Vínculos de Animais
            </h3>

            <div className="space-y-4"> {/* Adicionado para empilhar verticalmente */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <select 
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 font-bold transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%232563eb' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                  >
                    <option value="">Selecione um animal da lista...</option>
                    {allPets.map((p) => <option key={p.id} value={p.id}>{p.nome.toUpperCase()}</option>)}
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleLink} 
                    title="Vincular PET"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl h-13 shadow-lg shadow-blue-100 transition-all"
                  >
                    {updating ? <RefreshCw className="animate-spin" size={20} /> : <Link2 size={20} />}
                  </Button>

                  <Button 
                    onClick={handleUnlink} 
                    title="Desvincular PET"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl h-13 shadow-lg shadow-blue-100 transition-all"
                  >
                    {updating ? <RefreshCw className="animate-spin" size={20} /> : <Link2Off size={20} />}
                  </Button>
                </div>
              </div>

              {/* LINK DINÂMICO DE ATALHO PARA DETALHE DO PET SELECIONADO */}
              {selectedPetId && (
                <div className="px-2 pt-2 animate-in slide-in-from-top-2 duration-300">
                  <Link 
                    to={`/pets/${selectedPetId}`}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:text-blue-800 transition-all group"
                  >
                    <ExternalLink size={14} className="group-hover:scale-110 transition-transform" /> 
                    Clique aqui para ver ficha técnica e confirmar proprietário deste Pet
                  </Link>
                </div>
              )}
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => navigate(`/tutores/${id}/editar`)} className="rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 font-black px-12 h-14 uppercase text-xs tracking-widest cursor-pointer">
              <Edit3 size={18} className="mr-2" /> Editar Registro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}