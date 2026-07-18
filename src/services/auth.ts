import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/User';
import { 
  getUsers, 
  saveUsers, 
  getCurrentUser, 
  saveCurrentUser, 
  clearCurrentUser,
  getUserByEmail,
  addUser
} from './LocalStorage';
import { 
  validateRegisterForm,
  validateLoginForm
} from '../utils/validar';

const MAX_LOGIN_ATTEMPTS = 3;

// ============================================
// REGISTRO DE USUARIO
// ============================================

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const validation = validateRegisterForm({
    name: data.name,
    birthDate: data.birthDate,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword
  });
  
  if (!validation.isValid) {
    const errorMessages = Object.values(validation.errors).join('. ');
    return { 
      success: false, 
      message: `Error de validación: ${errorMessages}`
    };
  }
  
  const normalizedEmail = data.email.trim().toLowerCase();
  const existingUser = getUserByEmail(normalizedEmail);
  
  if (existingUser) {
    return { 
      success: false, 
      message: 'Este correo electrónico ya está registrado'
    };
  }
  
  const newUser: User = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    email: normalizedEmail,
    password: data.password,
    birthDate: data.birthDate,
    isBlocked: false,
    loginAttempts: 0,
    createdAt: new Date().toISOString()
  };
  
  const success = addUser(newUser);
  if (!success) {
    return { 
      success: false, 
      message: 'Error interno al guardar el registro en el sistema.'
    };
  }
  
  const userProfile = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    birthDate: newUser.birthDate,
    isBlocked: newUser.isBlocked,
    loginAttempts: newUser.loginAttempts,
    createdAt: newUser.createdAt
  };
  
  return { 
    success: true, 
    message: '✅ Usuario registrado exitosamente. Ahora puedes iniciar sesión.',
    user: userProfile
  };
};

// ============================================
// INICIO DE SESIÓN (LOGIN)
// ============================================

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const validation = validateLoginForm({
    email: credentials.email,
    password: credentials.password
  });
  
  if (!validation.isValid) {
    const errorMessages = Object.values(validation.errors).join('. ');
    return { 
      success: false, 
      message: `Error de validación: ${errorMessages}`
    };
  }
  
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const user = getUserByEmail(normalizedEmail);
  
  if (!user) {
    return { 
      success: false, 
      message: 'Usuario no encontrado. Por favor, regístrate primero.'
    };
  }
  
  if (user.isBlocked) {
    return { 
      success: false, 
      message: '🔒 Cuenta bloqueada por múltiples intentos fallidos. Contacta al soporte.'
    };
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (userIndex === -1) {
    return { 
      success: false, 
      message: 'Error de consistencia de datos del usuario.'
    };
  }

  if (user.password !== credentials.password) {
    const currentAttempts = (users[userIndex].loginAttempts || 0) + 1;
    users[userIndex].loginAttempts = currentAttempts;
    
    if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
      users[userIndex].isBlocked = true;
      saveUsers(users);
      return { 
        success: false, 
        message: `🔒 Cuenta bloqueada por alcanzar ${MAX_LOGIN_ATTEMPTS} intentos fallidos.`
      };
    }
    
    saveUsers(users);
    const attemptsLeft = MAX_LOGIN_ATTEMPTS - currentAttempts;
    return { 
      success: false, 
      message: `❌ Contraseña incorrecta. Te quedan ${attemptsLeft} intento${attemptsLeft > 1 ? 's' : ''}.`
    };
  }
  
  if (users[userIndex].loginAttempts > 0) {
    users[userIndex].loginAttempts = 0;
    saveUsers(users);
  }
  
  saveCurrentUser(user);
  
  const userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
    isBlocked: user.isBlocked,
    loginAttempts: user.loginAttempts,
    createdAt: user.createdAt
  };
  
  return { 
    success: true, 
    message: `👋 ¡Bienvenido/a, ${user.name}!`,
    user: userProfile
  };
};

// ============================================
// CIERRE DE SESIÓN (LOGOUT)
// ============================================

export const logoutUser = (): void => {
  clearCurrentUser();
};

// ============================================
// VERIFICACIÓN DE AUTENTICACIÓN
// ============================================

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return user !== null && !user.isBlocked;
};

export const getCurrentSessionUser = (): User | null => {
  const user = getCurrentUser();
  if (user?.isBlocked) {
    clearCurrentUser();
    return null;
  }
  return user;
};

// ============================================
// VERIFICAR CUMPLEAÑOS
// ============================================

export const isBirthdayToday = (birthDate: string): boolean => {
  if (!birthDate) return false;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  if (Number.isNaN(birth.getTime())) return false;
  
  return today.getUTCDate() === birth.getUTCDate() && 
         today.getUTCMonth() === birth.getUTCMonth();
};

// ============================================
// ADMINISTRACIÓN
// ============================================

export const getAllUsers = (): User[] => {
  return getUsers();
};

export const updateUser = (updatedUser: User): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === updatedUser.id);
  
  if (userIndex === -1) return false;
  
  users[userIndex] = { ...updatedUser, email: updatedUser.email.trim().toLowerCase() };
  saveUsers(users);
  
  const currentUser = getCurrentUser();
  if (currentUser?.id === updatedUser.id) {
    saveCurrentUser(users[userIndex]);
  }
  
  return true;
};

const setUserBlockStatus = (userId: string, isBlocked: boolean): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return false;
  
  users[userIndex].isBlocked = isBlocked;
  users[userIndex].loginAttempts = 0;
  saveUsers(users);
  
  const currentUser = getCurrentUser();
  if (currentUser?.id === userId) {
    if (isBlocked) {
      clearCurrentUser();
    } else {
      saveCurrentUser(users[userIndex]);
    }
  }
  
  return true;
};

export const blockUser = (userId: string): boolean => {
  return setUserBlockStatus(userId, true);
};

export const unblockUser = (userId: string): boolean => {
  return setUserBlockStatus(userId, false);
};