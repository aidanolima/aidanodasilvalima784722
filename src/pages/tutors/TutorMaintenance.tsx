import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Dog, Link, Unlink, Plus, Loader2 } from 'lucide-react';
import { tutorService } from '../../services/tutorService';
import { petService } from '../../services/petService';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { ImageUpload } from '../../components/ImageUpload';

export function TutorMaintenance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [linking, setLinking] = useState(false);
  
  const [tutor, setTutor] = useState<any>(null);
  const [tutorPets, setTutorPets] = useState<any[]>([]);
  const [allPets, setAllPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState('');

  const loadData = useCallback(async () => {
    const numericId = Number(id);
    if (isNaN(numericId)) return;

    try {
      setLoading(true);
      const data = await tutorService.getById(numericId);
      setTutor(data);
      
      // Busca pets do tutor (Trata 404 como [])
      const petsData = await tutorService.getPetsByTutor(numericId).catch(() => []);
      setTutorPets(Array.isArray(petsData) ? petsData : petsData.content || []);
      
      // Busca todos os pets para o seletor
      const listAll = await petService.getAll(0, 100);
      setAllPets(listAll.content || []);
    } catch (e) { 
      toast.error("Erro ao carregar dados."); 
      navigate('/tutores'); 
    } finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tutorService.update(Number(id), tutor);
      toast.success("Dados do tutor atualizados!");
    } catch (e) { toast.error("Erro ao salvar alterações."); }
  };

  const handleLink = async () => {
    if (!selectedPetId) return;
    setLinking(true);
    try {
      await tutorService.linkPet(Number(id), Number(selectedPetId));
      toast.success("Novo pet vinculado!");
      setSelectedPetId('');
      await loadData();
    } catch (e) { toast.error("Erro ao vincular."); }
    finally { setLinking(false); }
  };

  const handleUnlink = async (petId: number) => {
    if (!window.confirm("Remover o vínculo deste animal?")) return;
    try {
      await tutorService.unlinkPet(Number(id), petId);
      toast.success("Vínculo removido.");
      await loadData();
    } catch (e) { toast.error("Erro ao desvincular."); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-green-600" size={48} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 p-4 animate-in fade-in">
      <button onClick={() => navigate('/tutores')} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-green-600 transition-all">
        <ArrowLeft size={18} /> Voltar para listagem
      </button>
      
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Detalhamento Tutor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LADO ESQUERDO: FOTO */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm h-fit flex flex-col items-center">
          <ImageUpload 
            onUpload={async (f) => { 
              setUploading(true); 
              await tutorService.uploadFoto(Number(id), f); 
              await loadData(); 
              setUploading(false); 
              toast.success("Foto atualizada!");
            }} 
            isLoading={uploading} 
            currentImage={tutor.foto?.url || tutor.urlFoto} 
            type="tutor" 
          />
          <p className="mt-4 text-[10px] font-black text-slate-400 uppercase">Foto do Perfil</p>
        </div>

        {/* LADO DIREITO: DADOS E VÍNCULOS */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <Input label="Nome do Responsável" value={tutor.nome} onChange={e => setTutor({...tutor, nome: e.target.value})} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Telefone" value={tutor.telefone} onChange={e => setTutor({...tutor, telefone: e.target.value})} required />
              <Input label="Endereço Completo" value={tutor.endereco} onChange={e => setTutor({...tutor, endereco: e.target.value})} required />
            </div>
            <Button type="submit" className="w-full bg-slate-900 h-12 rounded-2xl shadow-lg"><Save size={18} /> SALVAR ALTERAÇÕES</Button>
          </form>

          {/* GESTÃO DE PETS */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
              <Link size={20} className="text-green-600" /> Pets sob Responsabilidade
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex-1">
                <Select 
                  label="Vincular Novo Pet" 
                  options={[
                    {value:'', label:'SELECIONE UM PET...'}, 
                    ...allPets.filter(p => !tutorPets.some(tp => tp.id === p.id)).map(p => ({value: p.id, label: p.nome.toUpperCase()}))
                  ]} 
                  value={selectedPetId} 
                  onChange={e => setSelectedPetId(e.target.value)} 
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleLink} isLoading={linking} disabled={!selectedPetId} className="bg-green-600 h-11.5 px-8 rounded-xl shadow-md">
                  <Plus size={18} /> Vincular
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorPets.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-green-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      {(p.foto?.url || p.urlFoto) ? (
                        <img src={p.foto?.url || p.urlFoto} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Dog size={20} /></div>
                      )}
                    </div>
                    <div>
                      <span className="font-black text-slate-800 text-sm uppercase leading-tight">{p.nome}</span>
                      <p className="text-[10px] text-green-600 font-bold uppercase">{p.especie}</p>
                    </div>
                  </div>
                  <button onClick={() => handleUnlink(p.id)} className="text-slate-200 hover:text-red-500 p-2 transition-colors">
                    <Unlink size={18} />
                  </button>
                </div>
              ))}
              {tutorPets.length === 0 && (
                <div className="col-span-full py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum pet vinculado a este tutor.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}