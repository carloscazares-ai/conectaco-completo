import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import App from './App.jsx';
import { SesionProvider } from './lib/sesion.jsx';
import { ToastProvider } from './components/Toast.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SesionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
