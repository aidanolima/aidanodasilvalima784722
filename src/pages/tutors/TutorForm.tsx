import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, UserCircle, RefreshCw } from 'lucide-react';
import { tutorService } from '../../services/tutorService';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ImageUpload } from '../../components/ImageUpload';

export function TutorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ nome: '', telefone: '', endereco: '' });
  const [currentPhoto, setCurrentPhoto] = useState('');

  // --- FUNÇÃO DE MÁSCARA PARA TELEFONE (9 DÍGITOS) ---
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo o que não é número
      .replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses no DDD
      .replace(/(\d{5})(\d)/, "$1-$2") // Coloca o hífen após o 5º dígito (padrão 9 dígitos)
      .replace(/(-\d{4})\d+?$/, "$1"); // Limita a quantidade de caracteres
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskPhone(e.target.value);
    setFormData({ ...formData, telefone: formatted });
  };

  useEffect(() => {
    if (isEditing) {
      tutorService.getById(Number(id)).then(data => {
        setFormData({ 
          nome: data.nome, 
          telefone: maskPhone(data.telefone || ''), // Aplica máscara ao carregar dados
          endereco: data.endereco 
        });
        setCurrentPhoto(data.foto?.url || data.urlFoto || '');
      }).catch(() => toast.error("Erro ao carregar dados do tutor."));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDAÇÃO RÍGIDA DOS 9 DÍGITOS ---
    const rawPhone = formData.telefone.replace(/\D/g, ""); // Remove a máscara para conferir
    if (rawPhone.length !== 11) {
      toast.error("O telefone deve conter o DDD e os 9 dígitos. Ex: (00) 90000-0000");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await tutorService.update(Number(id), formData);
        toast.success("Dados atualizados com sucesso!");
        navigate(`/tutores/${id}`);
      } else {
        const res = await tutorService.create(formData);
        toast.success("Tutor cadastrado com sucesso!");
        navigate(`/tutores/${res.id}`);
      }
    } catch (e) { 
      toast.error("Erro ao salvar dados. Verifique os campos."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if(!isEditing) { 
      toast.info("Por favor, salve os dados do tutor antes de enviar a foto."); 
      return; 
    }
    
    setUploading(true);
    try {
      const response = await tutorService.uploadFoto(Number(id), file);
      setCurrentPhoto(response.foto?.url || response.urlFoto || '');
      toast.success("Foto de perfil atualizada!");
    } catch (error) {
      toast.error("Erro ao realizar upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 p-4 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-blue-600 transition-all cursor-pointer group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Voltar
      </button>
      
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
          <UserCircle size={32} />
        </div>
        <div>
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest leading-none mb-1">Módulo de Gestão</p>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            {isEditing ? 'Atualizar Tutor' : 'Cadastrar Novo Tutor'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center h-fit">
            <ImageUpload 
              onUpload={handlePhotoUpload} 
              isLoading={uploading} 
              currentImage={currentPhoto} 
              type="tutor" 
            />
            <p className="mt-6 text-[10px] font-black text-slate-300 uppercase text-center leading-relaxed">
              Clique na imagem para <br /> alterar a foto de perfil
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-6">
              <Input 
                label="Nome Completo do Tutor" 
                value={formData.nome} 
                onChange={e => setFormData({...formData, nome: e.target.value})} 
                placeholder="EX: João da Silva"
                required 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CAMPO TELEFONE ADEQUADO COM MÁSCARA */}
                <Input 
                  label="Telefone / WhatsApp (9 dígitos)" 
                  value={formData.telefone} 
                  onChange={handlePhoneChange} 
                  placeholder="(00) 90000-0000"
                  required 
                />
                <Input 
                  label="Endereço Residencial" 
                  value={formData.endereco} 
                  onChange={e => setFormData({...formData, endereco: e.target.value})} 
                  placeholder="RUA, NÚMERO, BAIRRO"
                  required 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <Button 
                type="submit" 
                isLoading={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-2xl shadow-xl shadow-blue-100 text-sm tracking-widest"
              >
                {loading ? <RefreshCw className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                CONFIRMAR E SALVAR DADOS
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}