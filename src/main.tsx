import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeLocalStorage } from './services/LocalStorage';
import { initializeApiUsers } from './services/api';
import './styles/global.css';

// Inicializar LocalStorage una sola vez
initializeLocalStorage();

// Inicializar usuarios de la API (solo la primera vez)
initializeApiUsers();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);