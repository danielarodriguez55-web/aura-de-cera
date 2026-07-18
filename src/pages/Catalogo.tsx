import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/LocalStorage';
import type { Product } from '../types/Product';
import '../styles/catalogo.css';

const Catalogo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar productos al iniciar (Única fuente de verdad de sincronización)
  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);

    // Obtener categorías únicas dinámicamente
    const uniqueCategories = ['Todas', ...new Set(allProducts.map(p => p.category))];
    setCategories(uniqueCategories);
    
    setLoading(false);
  }, []);

  // Filtrado reactivo en tiempo de renderizado con useMemo (Elimina renders dobles)
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return products.filter(product => {
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesSearch = !term || 
        product.name.toLowerCase().includes(term) ||
        product.scent.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory('Todas');
    setSearchTerm('');
  };

  // Vista de carga semántica
  if (loading) {
    return (
      <div className="catalogo-loading" role="status" aria-live="polite">
        <span className="loading-icon" aria-hidden="true">🕯️</span>
        <p>Cargando nuestro catálogo aromático...</p>
      </div>
    );
  }

  return (
    <div className="catalogo-page">
      <header className="catalogo-header">
        <h1>
          <span role="img" aria-hidden="true">📦</span> Catálogo de Velas
        </h1>
        <p className="catalogo-subtitle">
          Descubre nuestra colección de velas artesanales tejidas con Aura de Cera
        </p>
      </header>

      {/* Barra de Herramientas de Filtrado y Búsqueda */}
      <section className="catalogo-filters-section" role="search" aria-label="Filtros del catálogo">
        <div className="search-container">
          <label htmlFor="catalogo-search" className="visually-hidden">Buscar productos</label>
          <input
            id="catalogo-search"
            type="search"
            placeholder="🔍 Buscar por nombre o aroma..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="category-filters" role="group" aria-label="Filtrar por categoría">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        {(selectedCategory !== 'Todas' || searchTerm) && (
          <button onClick={clearFilters} className="clear-filters-btn" type="button">
            Limpiar filtros
          </button>
        )}
      </section>

      {/* Resultados de la Colección */}
      <main className="catalogo-results">
        <p className="results-count" aria-live="polite">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="no-results" role="status">
              <span className="no-results-icon" aria-hidden="true">🔍</span>
              <h3>No se encontraron velas</h3>
              <p>Intenta cambiar los términos de búsqueda o selecciona otra categoría.</p>
              <button onClick={clearFilters} className="clear-filters-btn" type="button">
                Ver todos los productos
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Catalogo;