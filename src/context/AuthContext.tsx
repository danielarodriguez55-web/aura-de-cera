import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import type { User, UserProfile, RegisterData } from '../types/User';
import { 
  getCurrentUser, 
  clearCurrentUser
} from '../services/LocalStorage';
import { loginUser, logoutUser, registerUser, isBirthdayToday } from '../services/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkBirthday: (birthDate: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapToUserProfile = (user: User): UserProfile => ({
  id: user.id,
  name: user.name,
  email: user.email,
  birthDate: user.birthDate,
  isBlocked: user.isBlocked,
  loginAttempts: user.loginAttempts,
  createdAt: user.createdAt
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (currentUser && !currentUser.isBlocked) {
      setUser(mapToUserProfile(currentUser));
      setIsAuthenticated(true);
    } else if (currentUser?.isBlocked) {
      clearCurrentUser();
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginUser({ email, password });
    
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    
    return result;
  };

  const register = async (data: RegisterData) => {
    return await registerUser(data);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkBirthday = (birthDate: string) => {
    return isBirthdayToday(birthDate);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkBirthday
  }), [user, isAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};