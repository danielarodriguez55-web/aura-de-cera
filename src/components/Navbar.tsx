import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          🕯️ Aura de Cera
        </Link>

        {/* Botón hamburguesa (mobile) */}
        <button 
          className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Menú de navegación */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* Enlaces principales */}
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Inicio
          </Link>
          <Link to="/catalogo" className="nav-link" onClick={closeMenu}>
            Catálogo
          </Link>
          <Link to="/contacto" className="nav-link" onClick={closeMenu}>
            Contacto
          </Link>
          
          {/* Carrito - siempre visible */}
          <Link to="/carrito" className="nav-link cart-link" onClick={closeMenu}>
            🛒 Carrito
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </Link>

          {/* Opciones según autenticación */}
          {isAuthenticated ? (
            <>
              {/* Usuario autenticado */}
              <span className="nav-user">
                👋 Hola, {user?.name?.split(' ')[0] || 'Usuario'}
              </span>
              <button 
                onClick={handleLogout} 
                className="nav-btn logout-btn"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              {/* Usuario no autenticado */}
              <Link to="/login" className="nav-link" onClick={closeMenu}>
                Iniciar Sesión
              </Link>
              <Link to="/registro" className="nav-link register-link" onClick={closeMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;