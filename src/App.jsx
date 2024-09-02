import { useState } from 'react'
import './App.css'
import IniciarSesion from './components/administrarSesion/IniciarSesion'
import GestionarContenido from './components/main/gestionarContenido';
import { useSesionUsuario } from "../src/context/SesionUsuarioContext";
export default App
function App() {
  const { usuarioDetalles } = useSesionUsuario();
  return (
    <>
      {usuarioDetalles ? (
        <GestionarContenido />
      ) : (
        <IniciarSesion />
      )}
    </>
  );
}