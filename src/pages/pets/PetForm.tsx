import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Dog, RefreshCw, Info } from 'lucide-react';
import { petService } from '../../services/petService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ImageUpload } from '../../components/ImageUpload';
// IMPORTANTE: Importamos o tipo PetEspecie para o formulário
import type { PetEspecie } from '../../types';

export function PetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // SOLUÇÃO: Definimos a interface do formulário usando o tipo PetEspecie
  interface PetFormData {
    nome: string;
    especie: PetEspecie;
    raca: string;
    idade: number;
  }

  const [formData, setFormData] = useState<PetFormData>({
    nome: '',
    especie: 'Cachorro', // Inicializado com um valor válido do PetEspecie
    raca: '',
    idade: 0
  });
  
  const [currentPhoto, setCurrentPhoto] = useState('');

  const especies: PetEspecie[] = [
    'Cachorro', 
    'Gato', 
    'Aves', 
    'Peixes', 
    'Pequenos Mamíferos', 
    'Pets Exóticos'
  ];

  useEffect(() => {
    if (isEditing) {
      petService.getById(Number(id)).then(data => {
        setFormData({
          nome: data.nome,
          especie: data.especie as PetEspecie, // Garantimos a conversão de tipo aqui
          raca: data.raca || '',
          idade: data.idade || 0
        });
        setCurrentPhoto(data.foto?.url || data.urlFoto || '');
      }).catch(() => toast.error("Erro ao carregar dados do pet."));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        // Agora o formData é compatível com Partial<Pet>
        await petService.update(Number(id), formData);
        toast.success("Pet atualizado com sucesso!");
      } else {
        await petService.create(formData);
        toast.success("Pet cadastrado com sucesso!");
      }
      navigate('/pets');
    } catch (e) {
      toast.error("Erro ao processar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!isEditing) {
      toast.info("Salve os dados primeiro para habilitar a foto.");
      return;
    }
    setUploading(true);
    try {
      const response = await petService.uploadFoto(Number(id), file);
      setCurrentPhoto(response.foto?.url || response.urlFoto || '');
      toast.success("Foto atualizada!");
    } catch (error) {
      toast.error("Erro no upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 p-4 animate-in fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase hover:text-blue-600 transition-all cursor-pointer group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
          <Dog size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          {isEditing ? 'Editar Pet' : 'Novo Pet'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center">
            <ImageUpload onUpload={handlePhotoUpload} isLoading={uploading} currentImage={currentPhoto} type="pet" />
            {!isEditing && (
              <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <Info size={20} className="text-amber-500 shrink-0" />
                <p className="text-[10px] font-bold text-amber-700 uppercase">A foto é habilitada após o primeiro salvamento.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-6">
              <Input label="Nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate-500 font-black text-[11px] uppercase ml-1">Espécie</label>
                  <select 
                    value={formData.especie}
                    // O valor do select é convertido para PetEspecie ao salvar no estado
                    onChange={e => setFormData({...formData, especie: e.target.value as PetEspecie})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 h-14 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1.25rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                  >
                    {especies.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <Input label="Idade" type="number" value={formData.idade.toString()} onChange={e => setFormData({...formData, idade: Number(e.target.value)})} required />
              </div>
              <Input label="Raça" value={formData.raca} onChange={e => setFormData({...formData, raca: e.target.value})} />
            </div>

            <Button type="submit" isLoading={loading} className="w-full bg-blue-600 h-16 rounded-2xl shadow-xl shadow-blue-100 font-black tracking-widest text-xs">
              {loading ? <RefreshCw className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              SALVAR REGISTRO
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}