import React from 'react';
import '../styles/footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Sección 1: Logo y descripción */}
          <div className="footer-section">
            <h4>🕯️ Aura de Cera</h4>
            <p>Velas artesanales hechas con amor</p>
            <p className="footer-tagline">Iluminamos tus momentos especiales</p>
          </div>

          {/* Sección 2: Enlaces rápidos */}
          <div className="footer-section">
            <h4>Enlaces rápidos</h4>
            <ul className="footer-links">
              <li><a href="/">Inicio</a></li>
              <li><a href="/catalogo">Catálogo</a></li>
              <li><a href="/contacto">Contacto</a></li>
              <li><a href="/carrito">Carrito</a></li>
            </ul>
          </div>

          {/* Sección 3: Contacto */}
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>📧 contacto@auradecera.cl</p>
            <p>📱 +56 9 1234 5678</p>
            <p>📍 La Granja, Santiago</p>
          </div>

          {/* Sección 4: Horario */}
          <div className="footer-section">
            <h4>Horario de atención</h4>
            <p>Lunes a Viernes: 9:00 - 18:00</p>
            <p>Sábados: 10:00 - 14:00</p>
            <p>Domingos: Cerrado</p>
          </div>
        </div>

        {/* Footer inferior - DATOS DEL ESTUDIANTE (requerido) */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>
              Desarrollado por: <strong>Daniela Alejandra Rodriguez Morales</strong>
            </p>
            <p>
              Correo institucional: <strong>daniela.rodriguez55@inacap.cl</strong>
            </p>
            <p className="footer-copy">
              &copy; {currentYear} Aura de Cera - Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;