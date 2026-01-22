import React, { useRef } from 'react';
import { Upload, Loader2, Camera, Dog } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  currentImage?: string;
  type?: 'pet' | 'tutor'; // Adicionei para mudar o ícone conforme o contexto
}

export function ImageUpload({ onUpload, isLoading, currentImage, type = 'pet' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validação básica de tamanho (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Arquivo muito grande! Máximo 2MB.");
        return;
      }
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-slate-100 flex items-center justify-center relative shadow-md">
          {currentImage ? (
            <img 
              src={currentImage} 
              alt="Profile" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              onError={(e) => {
                // Se a imagem falhar ao carregar, remove a URL para mostrar o ícone
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('bg-slate-50');
              }}
            />
          ) : null}

          {/* Ícone de Avatar que só aparece se não houver imagem ou se ela falhar */}
          {!currentImage && (
            <div className="flex flex-col items-center text-slate-300">
              {type === 'pet' ? <Dog size={44} /> : <Camera size={44} />}
            </div>
          )}

          {/* Overlay de Loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[1px] transition-all">
              <Loader2 className="text-white animate-spin" size={28} />
            </div>
          )}
        </div>

        {/* Botão Flutuante de Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:bg-slate-400 border-2 border-white"
          title="Alterar foto"
        >
          <Upload size={16} strokeWidth={3} />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-1">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {isLoading ? 'Enviando arquivo...' : 'JPG, PNG ou GIF (Máx. 2MB)'}
        </p>
      </div>
    </div>
  );
}