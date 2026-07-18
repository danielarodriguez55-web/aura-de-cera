import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/LocalStorage';
import type { Product } from '../types/Product';
import '../styles/home.css';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Cargar productos destacados filtrados de forma real
    const products = getProducts();
    const featured = products.filter(p => p.featured === true).slice(0, 3);
    setFeaturedProducts(featured);
    setLoading(false);
  }, []);

  return (
    <div className="home-page">
      {/* Sección Hero */}
      <Hero />

      {/* Sección Sobre Nosotros / Propuesta de Valor */}
      <section className="about-section" aria-labelledby="about-heading">
        <div className="about-container">
          <h2 id="about-heading" className="about-title">
            <span role="img" aria-hidden="true">✨</span> ¿Quiénes Somos?
          </h2>
          
          <div className="about-content">
            <p>
              En <strong>Aura de Cera</strong> creamos velas artesanales con{' '}
              <strong>cera de soja 100% natural</strong>, fragancias de alta calidad{' '}
              y un toque único en cada pieza.
            </p>
            <p>
              Nuestro objetivo es iluminar tus momentos especiales con aromas que{' '}
              evocan emociones y crean atmósferas inolvidables.
            </p>

            {/* ✅ CORREGIDO: Usar <ul> y <li> semánticos */}
            <ul className="about-values" aria-label="Nuestros valores fundamentales">
              <li className="about-value">
                <span className="value-icon" aria-hidden="true">🌱</span>
                <h3>Natural</h3>
                <p>Cera de soja biodegradable</p>
              </li>
              <li className="about-value">
                <span className="value-icon" aria-hidden="true">🎨</span>
                <h3>Artesanal</h3>
                <p>Hecho a mano con dedicación</p>
              </li>
              <li className="about-value">
                <span className="value-icon" aria-hidden="true">🌸</span>
                <h3>Único</h3>
                <p>Aromas exclusivos</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección de Productos Destacados */}
      <main className="featured-section" aria-labelledby="featured-heading">
        <div className="featured-container">
          <h2 id="featured-heading" className="featured-title">
            <span role="img" aria-hidden="true">🌟</span> Productos Destacados
          </h2>
          <p className="featured-subtitle">
            Descubre nuestras velas más populares
          </p>

          {loading ? (
            // ✅ CORREGIDO: Usar aria-live en lugar de role="status"
            <div className="loading-spinner" aria-live="polite">
              <span className="spinner-icon" aria-hidden="true">🕯️</span>
              <p>Cargando productos populares...</p>
            </div>
          ) : (
            <div className="featured-grid">
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                // ✅ CORREGIDO: Usar aria-live en lugar de role="status"
                <div className="no-products" aria-live="polite">
                  <p>Pronto tendremos nuevas sorpresas destacadas disponibles.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;