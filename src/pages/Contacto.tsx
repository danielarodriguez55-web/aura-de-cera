import React, { useState, useEffect, useRef } from 'react';
import '../styles/contacto.css';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // ✅ CORREGIDO: Usar number en lugar de NodeJS.Timeout
  const timeoutRef = useRef<number | null>(null);

  // Limpieza del temporizador en el desmontaje
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Formulario enviado:', formData);
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
    
    // Limpiar temporizador previo si existiera
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Ocultar mensaje de éxito tras 4 segundos de forma segura
    timeoutRef.current = setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  // ✅ Coordenadas oficiales de INACAP La Granja
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.2635398242277!2d-70.62319202341253!3d-33.520556273363364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d06fa99e691d%3A0xbc4e8990a424e4c2!2sINACAP%20La%20Granja!5e0!3m2!1ses!2scl!4v1710000000000";

  return (
    <div className="contacto-page">
      <div className="contacto-container">
        <header className="contacto-header">
          <h1>
            <span role="img" aria-hidden="true">📧</span> Contacto
          </h1>
          <p className="contacto-subtitle">
            ¿Tienes dudas, sugerencias o quieres un pedido personalizado? ¡Escríbenos!
          </p>
        </header>

        <div className="contacto-grid">
          {/* Sección del Formulario */}
          <section className="contacto-form-container" aria-label="Formulario de contacto">
            <form onSubmit={handleSubmit} className="contacto-form">
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. María Rossi"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Escribe tu consulta en detalle aquí..."
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>

              <div aria-live="polite" aria-atomic="true" className="feedback-container">
                {submitted && (
                  <div className="success-message">
                    <span role="img" aria-label="Éxito">✅</span> ¡Mensaje enviado con éxito! Te responderemos muy pronto.
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* Información de contacto + Mapa */}
          <aside className="contact-info" aria-label="Información corporativa y ubicación">
            <div className="info-card">
              <h3>
                <span role="img" aria-hidden="true">📍</span> Dirección
              </h3>
              <p>Av. Américo Vespucio 950</p>
              <p>La Granja, Santiago</p>
            </div>

            <div className="info-card">
              <h3>
                <span role="img" aria-hidden="true">📞</span> Teléfono
              </h3>
              <p>+56 2 2471 2000</p>
            </div>

            <div className="info-card">
              <h3>
                <span role="img" aria-hidden="true">📧</span> Correo
              </h3>
              <p>contacto@auradecera.cl</p>
            </div>

            {/* MAPA INTERACTIVO EMBEBIDO */}
            <div className="info-card map-card">
              <h3>
                <span role="img" aria-hidden="true">🗺️</span> Ubicación
              </h3>
              <div className="map-container">
                <iframe
                  src={mapSrc}
                  className="map-iframe"
                  title="Ubicación de INACAP La Granja"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
              <a 
                href="https://maps.google.com/?q=INACAP+La+Granja+Av+Americo+Vespucio+950" 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-link"
              >
                📍 Abrir en Google Maps
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Contact;