import axios, { type AxiosResponse } from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Tipos de datos
export interface LoginData {
  usuario: string;
  contraseña: string;
}

export interface User {
  id: number;
  usuario: string;
  rol: string;
  empleado?: {
    id: number;
    nombre: string;
    apellido: string;
    ci: string;
    area?: {
      id: number;
      nombre: string;
    };
    cargo?: {
      id: number;
      nombre: string;
    };
  };
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  ci: string;
  nacionalidad: string;
  fecha_entrada: string;
  fecha_salida?: string;
  estado: string;
  observaciones?: string;
  area: {
    id: number;
    nombre: string;
  };
  cargo: {
    id: number;
    nombre: string;
  };
}

// Servicios de API
export const authService = {
  login: async (credentials: LoginData): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post('/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/logout');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<{ user: User }> = await api.get('/user');
    return response.data.user;
  },
};

export const empleadoService = {
  getAll: async (): Promise<Empleado[]> => {
    const response: AxiosResponse<Empleado[]> = await api.get('/empleados');
    return response.data;
  },
  
  getById: async (id: number): Promise<Empleado> => {
    const response: AxiosResponse<Empleado> = await api.get(`/empleados/${id}`);
    return response.data;
  },
  
  search: async (query: string): Promise<Empleado[]> => {
    const response: AxiosResponse<Empleado[]> = await api.get(`/empleados/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export default api;