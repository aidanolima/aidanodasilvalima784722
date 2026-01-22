import api from './api';
import type { Tutor } from '../types';

export const tutorService = {
  getAll: async (page = 0, size = 10, nome = '') => {
    const { data } = await api.get(`/v1/tutores`, {
      params: { page, size, nome }
    });
    return data;
  },

  getById: async (id: number): Promise<Tutor> => {
    const { data } = await api.get(`/v1/tutores/${id}`);
    return data;
  },

  create: async (tutor: Omit<Tutor, 'id'>): Promise<Tutor> => {
    const { data } = await api.post('/v1/tutores', tutor);
    return data;
  },

  update: async (id: number, tutor: Partial<Tutor>) => {
    const { data } = await api.put(`/v1/tutores/${id}`, tutor);
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/v1/tutores/${id}`);
  },

  // Inclusão do método de upload para corrigir o erro no TutorForm
  uploadFoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('foto', file);
    const { data } = await api.post(`/v1/tutores/${id}/fotos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  linkPet: async (tutorId: number, petId: number) => {
    return await api.post(`/v1/tutores/${Number(tutorId)}/pets/${Number(petId)}`);
  },

  unlinkPet: async (tutorId: number, petId: number) => {
    return await api.delete(`/v1/tutores/${Number(tutorId)}/pets/${Number(petId)}`);
  },

  // Sua implementação com normalização de dados e tratamento de 404
  getPetsByTutor: async (tutorId: number) => {
    try {
      const { data } = await api.get(`/v1/tutores/${Number(tutorId)}/pets`);
      const list = data?.content || data?.data || (Array.isArray(data) ? data : []);
      return list;
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      return [];
    }
  }
};