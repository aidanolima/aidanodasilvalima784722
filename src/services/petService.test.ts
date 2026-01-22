import api from '../api/axiosInstance';
import type { Pet, PaginatedResponse } from '../types';

export const petService = {
  getAll: async (page = 0, size = 10, nome?: string) => {
    const params: any = { page, size };
    if (nome) params.search = nome.trim();

    try {
      const { data } = await api.get('/v1/pets', { params });
      if (Array.isArray(data)) {
        return {
          content: data,
          totalElements: data.length,
          totalPages: 1,
        } as PaginatedResponse<Pet>;
      }
      return data as PaginatedResponse<Pet>;
    } catch (error) { throw error; }
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

  // SOLUÇÃO DEFINITIVA: Deixamos o navegador gerenciar o Content-Type
  uploadFoto: async (id: number, file: File) => {
    const numericId = Number(id);
    const formData = new FormData();
    formData.append('foto', file); 

    try {
      // IMPORTANTE: NÃO passamos headers manuais aqui para evitar o erro @Consumes
      const { data } = await api.post(`/v1/pets/${numericId}/fotos`, formData); 
      return data;
    } catch (error: any) {
      console.error("❌ Erro no upload:", error.response?.data);
      throw error;
    }
  },
};