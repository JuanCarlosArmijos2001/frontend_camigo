import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SesionUsuarioContextProvider } from "../src/context/SesionUsuarioContext";
import { SesionKeycloakContextProvider } from './context/SesionKeycloakContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SesionKeycloakContextProvider>
      <SesionUsuarioContextProvider>
        <App />
      </SesionUsuarioContextProvider>
    </SesionKeycloakContextProvider>
  </StrictMode>,
)
