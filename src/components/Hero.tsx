import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero" aria-label="Bienvenida a Aura de Cera">
      <div className="hero-container">
        <div className="hero-content">
          
          {/* Bloque de Texto */}
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-icon" aria-hidden="true">🕯️</span>
              {' '}Aura de Cera
            </h1>
            <p className="hero-subtitle">
              Velas artesanales hechas con amor y aromas que transforman tu espacio
            </p>
            
            {/* Lista semántica de características */}
            <ul className="hero-features" aria-label="Características de nuestros productos">
              <li>
                <span role="img" aria-label="Planta: ">🌿</span>
                {' '}Cera de soja 100% natural
              </li>
              <li>
                <span role="img" aria-label="Flor: ">🌸</span>
                {' '}Aromas únicos
              </li>
              <li>
                <span role="img" aria-label="Paleta de pintor: ">🎨</span>
                {' '}Diseños exclusivos
              </li>
            </ul>
            
            <Link to="/catalogo" className="hero-btn" aria-label="Explorar nuestro catálogo de velas">
              Explorar Catálogo
              {' '}<span className="hero-btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Bloque de Imagen / Banner Ilustrativo */}
          <div className="hero-image" role="img" aria-label="Muestra visual de velas artesanales hechas a mano">
            <div className="hero-image-placeholder" aria-hidden="true">
              <span className="placeholder-icon">🕯️</span>
              <p>Velas Artesanales</p>
              <small>Hechas a mano con dedicación</small>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;