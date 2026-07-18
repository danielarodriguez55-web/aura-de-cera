import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Contacto from './pages/Contacto';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import './styles/global.css';
import './styles/protectedRoute.css';

// Componente helper para reiniciar el scroll en cada cambio de ruta (UX/Accesibilidad)
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="app-layout-container">
            {/* Cabecera global */}
            <Navbar />
            
            {/* Contenedor principal con rol para tecnologías asistivas */}
            <main id="main-content" className="main-content" role="main">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/contacto" element={<Contacto />} />
                
                {/* Rutas protegidas */}
                <Route 
                  path="/carrito" 
                  element={
                    <ProtectedRoute redirectTo="/login">
                      <Cart />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Gestión de rutas no encontradas */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            {/* Pie de página global */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;