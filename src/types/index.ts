// Definição estrita das espécies aceitas pelo sistema
export type PetEspecie = 
  | 'Cachorro' 
  | 'Gato' 
  | 'Aves' 
  | 'Peixes' 
  | 'Pequenos Mamíferos' 
  | 'Pets Exóticos';

export interface Pet {
  id: number;
  nome: string;
  especie: PetEspecie; // Agora usa o tipo específico para maior segurança
  raca?: string;
  idade?: number;
  urlFoto?: string;
  tutorId?: number;
  foto?: {
    url: string;
    id: string;
  };
}

export interface Tutor {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  urlFoto?: string;
  pets?: Pet[]; // Lista de pets vinculados que injetamos no loadData
  foto?: {
    url: string;
    id: string;
  };
}

// Interface para respostas paginadas da API (Swagger/Quarkus)
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AuthState {
  user: {
    id: string;
    email: string;
    nome: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  user?: {
    id: number;
    nome: string;
    username: string;
    // adicione outros campos do usuário se houver
  };
}