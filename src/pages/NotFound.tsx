import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-page">
      <main className="not-found-container" aria-live="polite">
        <div className="not-found-icon" aria-hidden="true">🔍</div>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p className="not-found-description">
          Lo sentimos, la página que buscas no existe, ha sido movida o su aroma se desvaneció.
        </p>
        
        <div className="not-found-actions">
          <Link to="/" className="home-link">
            <span role="img" aria-hidden="true">🏠</span> Volver al inicio
          </Link>
          <Link to="/catalogo" className="catalog-link">
            <span role="img" aria-hidden="true">📦</span> Ver catálogo
          </Link>
        </div>
        
        <p className="not-found-help">
          ¿Necesitas ayuda? <Link to="/contacto">Contáctanos</Link>
        </p>
      </main>
    </div>
  );
};

export default NotFound;