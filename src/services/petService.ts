import api from '../api/axiosInstance';
import type { Pet, PaginatedResponse } from '../types';

export const petService = {
  // ADEQUAÇÃO: Foco total na paginação e busca global
  getAll: async (page = 0, size = 10, nome?: string) => {
    const params: any = { page, size };
    
    // Sincronizado com Tutores: busca em todo o banco
    if (nome) {
      params.nome = nome.trim().toUpperCase(); 
    }

    try {
      const { data } = await api.get('/v1/pets', { params });
      
      // Se a API retornar um array simples, transformamos em formato paginado
      if (Array.isArray(data)) {
        return { 
          content: data, 
          totalElements: data.length, 
          totalPages: 1 
        } as PaginatedResponse<Pet>;
      }
      
      // Se a API retornar o objeto mas esquecer o totalPages, nós calculamos aqui
      if (data && !data.totalPages && data.totalElements) {
        data.totalPages = Math.ceil(data.totalElements / size);
      }
      
      return data as PaginatedResponse<Pet>;
    } catch (error) { 
      throw error; 
    }
  },

  getById: async (id: number) => {
    const { data } = await api.get<Pet>(`/v1/pets/${Number(id)}`);
    return data;
  },

  create: async (pet: Omit<Pet, 'id'>) => {
    const { data } = await api.post<Pet>('/v1/pets', pet);
    return data;
  },

  update: async (id: number, pet: Partial<Pet>) => {
    const { data } = await api.put<Pet>(`/v1/pets/${Number(id)}`, pet);
    return data;
  },
  
  delete: async (id: number) => {
    await api.delete(`/v1/pets/${Number(id)}`);
  },

  uploadFoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('foto', file); 

    try {
      const { data } = await api.post(`/v1/pets/${Number(id)}/fotos`, formData, {
        headers: {
          'Content-Type': undefined // O navegador assume o controle do Boundary
        }
      }); 
      return data;
    } catch (error: any) {
      console.error("❌ Detalhe do erro no Servidor:", error.response?.data);
      throw error;
    }
  },
};