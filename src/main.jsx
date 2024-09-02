import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SesionUsuarioContextProvider } from "../src/context/SesionUsuarioContext";
import { KeycloakProvider } from "../src/context/KeycloakContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <KeycloakProvider> */}
      <SesionUsuarioContextProvider>
        <App />
      </SesionUsuarioContextProvider>
    {/* </KeycloakProvider> */}
  </StrictMode>,
)
