
// ============================================
// TIPOS DE VALIDACIÓN
// ============================================

export interface RegisterValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    birthDate?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;  // ✅ AGREGAR confirmPassword
  };
}

export interface LoginValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    message?: string;
  };
}

// ============================================
// VALIDACIÓN DE EMAIL
// ============================================

export const validateEmail = (email: string): boolean => {
  const allowedDomains = ['@gmail.com', '@inacap.cl'];
  return allowedDomains.some(domain => email.endsWith(domain));
};

export const getEmailError = (email: string): string => {
  if (!email) return 'El correo electrónico es obligatorio';
  if (!email.includes('@')) return 'El correo debe contener @';
  if (!validateEmail(email)) return 'Solo se permiten @gmail.com y @inacap.cl';
  return '';
};

// ============================================
// VALIDACIÓN DE CONTRASEÑA
// ============================================

export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length === 0) {
    errors.push('La contraseña es obligatoria');
    return errors;
  }
  
  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Debe tener al menos una minúscula');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe tener al menos una mayúscula');
  }
  if (!/\d/.test(password)) {
    errors.push('Debe tener al menos un número');
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Debe tener al menos un carácter especial (@$!%*?&)');
  }
  
  return errors;
};

export const getPasswordError = (password: string): string => {
  const errors = getPasswordErrors(password);
  return errors.length > 0 ? errors[0] : '';
};

// ============================================
// VALIDACIÓN DE EDAD
// ============================================

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const isOver18 = (birthDate: string): boolean => {
  return calculateAge(birthDate) >= 18;
};

export const getAgeError = (birthDate: string): string => {
  if (!birthDate) return 'La fecha de nacimiento es obligatoria';
  if (!isOver18(birthDate)) return 'Debes ser mayor de 18 años para registrarte';
  return '';
};

// ============================================
// VALIDACIÓN DE NOMBRE
// ============================================

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const getNameError = (name: string): string => {
  if (!name || name.trim().length === 0) return 'El nombre es obligatorio';
  if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  return '';
};

// ============================================
// VALIDACIÓN DE FORMULARIO DE REGISTRO
// ============================================

// ✅ CORREGIDO: Incluir confirmPassword
export const validateRegisterForm = (data: {
  name: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;  // ✅ AGREGAR confirmPassword
}): RegisterValidationResult => {
  const errors: RegisterValidationResult['errors'] = {};
  
  const nameError = getNameError(data.name);
  if (nameError) errors.name = nameError;
  
  const ageError = getAgeError(data.birthDate);
  if (ageError) errors.birthDate = ageError;
  
  const emailError = getEmailError(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = getPasswordError(data.password);
  if (passwordError) errors.password = passwordError;
  
  // ✅ Validar que las contraseñas coincidan
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// VALIDACIÓN DE FORMULARIO DE LOGIN
// ============================================

export const validateLoginForm = (data: {
  email: string;
  password: string;
}): LoginValidationResult => {
  const errors: LoginValidationResult['errors'] = {};
  
  if (!data.email) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Solo se permiten @gmail.com y @inacap.cl';
  }
  
  if (!data.password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (data.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// VALIDACIÓN DE CONTACTO
// ============================================

export const validateContactForm = (data: {
  name: string;
  email: string;
  message: string;
}): ContactValidationResult => {
  const errors: ContactValidationResult['errors'] = {};
  
  const nameError = getNameError(data.name);
  if (nameError) errors.name = nameError;
  
  const emailError = getEmailError(data.email);
  if (emailError) errors.email = emailError;
  
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'El mensaje es obligatorio';
  } else if (data.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};