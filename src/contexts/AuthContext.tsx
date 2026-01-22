import React, { createContext, useContext, useState } from 'react';

interface AuthContextData {
  signed: boolean;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const signOut = () => {
    // 1. Limpa os dados físicos
    localStorage.removeItem('token');
    localStorage.removeItem('@PetAdmin:user');
    
    // 2. Reseta o estado do React
    setToken(null);
    
    // 3. Redireciona e limpa o histórico de navegação
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ signed: !!token, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);