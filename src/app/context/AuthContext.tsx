import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'proveedor' | 'cliente';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email: string;
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de ejemplo para demo
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin': {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      role: 'admin',
      email: 'admin@toolrental.com',
      nombre: 'Administrador General',
    },
  },
  'proveedor': {
    password: 'prov123',
    user: {
      id: '2',
      username: 'proveedor',
      role: 'proveedor',
      email: 'proveedor@toolrental.com',
      nombre: 'Juan Pérez',
    },
  },
  'cliente': {
    password: 'cliente123',
    user: {
      id: '3',
      username: 'cliente',
      role: 'cliente',
      email: 'cliente@example.com',
      nombre: 'María García',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = mockUsers[username];
    if (mockUser && mockUser.password === password && mockUser.user.role === role) {
      setUser(mockUser.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
