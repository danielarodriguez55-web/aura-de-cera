import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validar';
import '../styles/registro.css';

const Registro: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    birthDate?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touchedFields.has(name)) {
      validateField(name, value);
    }
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateField = (field: string, value: string) => {
    if (field === 'confirmPassword' && !formData.password) {
      return;
    }

    const dataToValidate = {
      name: field === 'name' ? value : formData.name,
      birthDate: field === 'birthDate' ? value : formData.birthDate,
      email: field === 'email' ? value : formData.email,
      password: field === 'password' ? value : formData.password,
      confirmPassword: field === 'confirmPassword' ? value : formData.confirmPassword
    };
    
    const validation = validateRegisterForm(dataToValidate);
    
    if (!validation.isValid && validation.errors[field as keyof typeof validation.errors]) {
      setErrors(prev => ({ 
        ...prev, 
        [field]: validation.errors[field as keyof typeof validation.errors] 
      }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'password' && formData.confirmPassword) {
      const confirmValidation = validateRegisterForm({
        name: formData.name,
        birthDate: formData.birthDate,
        email: formData.email,
        password: value,
        confirmPassword: formData.confirmPassword
      });
      
      if (!confirmValidation.isValid && confirmValidation.errors.confirmPassword) {
        setErrors(prev => ({ 
          ...prev, 
          confirmPassword: confirmValidation.errors.confirmPassword 
        }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => new Set(prev).add(name));
    
    if (value && !(name === 'confirmPassword' && !formData.password)) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const validation = validateRegisterForm({
        name: formData.name,
        birthDate: formData.birthDate,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsLoading(false);
        return;
      }

      // ✅ PASAMOS LA CONTRASEÑA PARA QUE SE GUARDE
      const result = await register({
        name: formData.name,
        birthDate: formData.birthDate,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSubmitError(result.message);
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setSubmitError('Error al registrar usuario. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registro-page">
      <main className="registro-container">
        <header className="registro-header">
          <h1>
            <span role="img" aria-hidden="true">🕯️</span> Crear Cuenta
          </h1>
          <p>Únete a la comunidad de Aura de Cera</p>
        </header>

        <div aria-live="assertive">
          {submitError && <div className="error-message" role="alert">❌ {submitError}</div>}
          {success && <div className="success-message" role="status">✅ {success}</div>}
        </div>

        <form onSubmit={handleSubmit} className="registro-form" noValidate>
          
          {/* Campo: Nombre */}
          <div className="form-group">
            <label htmlFor="name">Nombre completo</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu nombre completo"
              required
              disabled={isLoading}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && (
              <span className="field-error" id="name-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Campo: Fecha de Nacimiento */}
          <div className="form-group">
            <label htmlFor="birthDate">Fecha de nacimiento</label>
            <input
              id="birthDate"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={isLoading}
              aria-invalid={!!errors.birthDate}
              aria-describedby={`birthDate-hint ${errors.birthDate ? "birthDate-error" : ""}`}
              className={errors.birthDate ? 'error' : ''}
            />
            {errors.birthDate && (
              <span className="field-error" id="birthDate-error" role="alert">
                {errors.birthDate}
              </span>
            )}
            <span className="field-hint" id="birthDate-hint">Debes ser mayor de 18 años</span>
          </div>

          {/* Campo: Email */}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="ejemplo@gmail.com"
              required
              disabled={isLoading}
              aria-invalid={!!errors.email}
              aria-describedby={`email-hint ${errors.email ? "email-error" : ""}`}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="field-error" id="email-error" role="alert">
                {errors.email}
              </span>
            )}
            <span className="field-hint" id="email-hint">Solo se permiten @gmail.com y @inacap.cl</span>
          </div>

          {/* Campo: Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Mínimo 8 caracteres"
                required
                disabled={isLoading}
                aria-invalid={!!errors.password}
                aria-describedby={`password-hint ${errors.password ? "password-error" : ""}`}
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <span aria-hidden="true">{showPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
            {errors.password && (
              <span className="field-error" id="password-error" role="alert">
                {errors.password}
              </span>
            )}
            <span className="field-hint" id="password-hint">
              Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)
            </span>
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repite tu contraseña"
                required
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
              >
                <span aria-hidden="true">{showConfirmPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="field-error" id="confirmPassword-error" role="alert">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="registro-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <footer className="registro-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login" className="login-link">Inicia sesión aquí</Link>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Registro;