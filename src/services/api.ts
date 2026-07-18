import axios from 'axios';
import type { User } from '../types/User';
import { getUsers, saveUsers } from './LocalStorage';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

// ============================================
// TIPOS DE LA API
// ============================================

export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

export interface RegisterApiUsersResponse {
  success: boolean;
  message: string;
  registeredCount: number;
}

// ============================================
// OBTENER USUARIOS DE LA API EXTERNA
// ============================================

export const fetchApiUsers = async (): Promise<ApiUser[]> => {
  try {
    const response = await axios.get<ApiUser[]>(API_URL, {
      timeout: 10000 // 10 segundos de límite
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al consumir API externa:', error);
    throw error;
  }
};

// ============================================
// REGISTRAR USUARIOS DE LA API EN EL SISTEMA
// ============================================

export const registerApiUsers = async (): Promise<RegisterApiUsersResponse> => {
  try {
    // Obtener usuarios actuales
    const currentUsers = getUsers();
    
    // Verificar emails existentes
    const existingEmails = new Set(currentUsers.map(u => u.email.trim().toLowerCase()));
    
    // Obtener usuarios de la API
    const apiUsers = await fetchApiUsers();
    
    // Tomar solo los primeros 3 usuarios
    const firstThreeApiUsers = apiUsers.slice(0, 3);
    
    // Filtrar los que ya existen
    const newApiUsers = firstThreeApiUsers.filter(apiUser => 
      !existingEmails.has(apiUser.email.trim().toLowerCase())
    );
    
    if (newApiUsers.length === 0) {
      return {
        success: true,
        message: '✅ Los usuarios de la API ya están registrados',
        registeredCount: 0
      };
    }
    
    const timestamp = Date.now();
    
    // Convertir a nuestro formato de User (CON PASSWORD)
    const usersToRegister: User[] = newApiUsers.map((apiUser, index) => ({
      id: `api_${index + 1}_${timestamp}`,
      name: apiUser.name,
      email: apiUser.email.trim().toLowerCase(),
      password: 'Inacap123', // Contraseña por defecto
      birthDate: '2000-01-01', // Fecha por defecto
      isBlocked: false,
      loginAttempts: 0,
      createdAt: new Date().toISOString()
    }));
    
    // Guardar en LocalStorage
    const updatedUsers = [...currentUsers, ...usersToRegister];
    saveUsers(updatedUsers);
    
    return {
      success: true,
      message: `✅ ${usersToRegister.length} usuarios registrados desde la API`,
      registeredCount: usersToRegister.length
    };
    
  } catch (error) {
    console.error('❌ Error al registrar usuarios de API:', error);
    
    let errorMessage = 'Error al conectar con la API externa';
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        errorMessage = '⏰ La conexión con la API ha expirado. Revisa tu conexión a internet.';
      } else if (error.response) {

        errorMessage = `❌ Error del servidor remoto: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = '🌐 No se pudo establecer respuesta del servidor. Revisa tu conexión a internet.';
      }
    }
    
    return {
      success: false,
      message: errorMessage,
      registeredCount: 0
    };
  }
};

// ============================================
// INICIALIZAR USUARIOS DE API (Manejador de Estado)
// ============================================

let apiInitialized = false;

export const initializeApiUsers = async (): Promise<void> => {
  // Evitar múltiples llamadas
  if (apiInitialized) return;
  
  try {
    const result = await registerApiUsers();
    console.log('🔄 API Users:', result.message);
    apiInitialized = true;
  } catch (error) {
    console.error('❌ Error inicializando API users:', error);
  }
};

export const resetApiInitialized = (): void => {
  apiInitialized = false;
};

export const getApiUsersWithFullData = async (): Promise<ApiUser[]> => {
  try {
    return await fetchApiUsers();
  } catch (error) {
    console.error('Error al obtener usuarios completos:', error);
    return [];
  }
};

// ============================================
// VERIFICAR DISPONIBILIDAD (Health Check)
// ============================================

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    // HEAD optimiza el canal de red al no descargar el cuerpo JSON completo
    await axios.head(API_URL, { timeout: 4000 });
    return true;
  } catch {
    try {
      // Fallback a GET por si el servidor no acepta peticiones HEAD
      await axios.get(API_URL, { timeout: 4000 });
      return true;
    } catch {
      return false;
    }
  }
};