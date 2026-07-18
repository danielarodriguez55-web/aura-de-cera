export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthDate: string;
  isBlocked: boolean;
  loginAttempts: number;
  createdAt: string;
}

export type UserProfile = Omit<User, 'password'>;

export interface LoginCredentials {
  email: string;
  password: string;
}

// ✅ RegisterData CON PASSWORD
export interface RegisterData {
  name: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

export interface LoginAttempt {
  email: string;
  timestamp: string;
  success: boolean;
}