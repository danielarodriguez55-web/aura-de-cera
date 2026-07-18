import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Importar todas las páginas
import Home from '../pages/Home';
import Catalogo from '../pages/Catalogo';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Contacto from '../pages/Contacto';
import Cart from '../pages/Cart';
import NotFound from '../pages/NotFound';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/producto/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/contacto" element={<Contacto />} />
      
      {/* Rutas protegidas (requieren autenticación) */}
      <Route 
        path="/carrito" 
        element={
          <ProtectedRoute redirectTo="/login">
            <Cart />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta 404 - Siempre al final */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;