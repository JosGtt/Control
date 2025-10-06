import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (usuario: string, contraseña: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Si hay error al parsear, limpiar el storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (usuario: string, contraseña: string): Promise<boolean> => {
    try {
      // Verificación temporal hardcodeada mientras se configura la base de datos
      if (usuario === 'jose' && contraseña === '123456') {
        const mockUser = {
          id: 1,
          usuario: 'jose',
          rol: 'admin',
          empleado: {
            id: 1,
            nombre: 'Jose',
            apellido: 'Admin',
            ci: '12345678'
          }
        };
        const mockToken = 'mock-token-123456';
        
        // Guardar token y usuario
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setToken(mockToken);
        setUser(mockUser);
        
        return true;
      }
      
      // Si las credenciales no coinciden, intentar con el API
      const response = await authService.login({ usuario, contraseña });
      
      // Guardar token y usuario
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setToken(response.access_token);
      setUser(response.user);
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};