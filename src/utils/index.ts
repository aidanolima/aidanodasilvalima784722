// src/types/index.ts

export interface User {
  id: number;
  email: string;
  nome: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface Pet {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  raca: string;
  urlFoto?: string; // Opcional pois depende de upload
  tutorId?: number; // Para vincular ao tutor
}

export interface Tutor {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  urlFoto?: string;
  pets?: Pet[]; // Lista de pets vinculados [cite: 41]
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}