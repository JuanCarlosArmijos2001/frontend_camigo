// import './App.css'
import React, { useEffect, useState } from "react";
import PaginaPrincipal from '../src/components/main/paginaPrincipal/PaginaPrincipal';
import PaginaInicio from './components/paginaInicio/PaginaInicio';
import { useSesionUsuario, } from "../src/context/SesionUsuarioContext";
import { useSesionKeycloak } from '../src/context/SesionKeycloakContext';
import { TemaSeleccionadoContextProvider } from "../src/context/TemaSeleccionadoContext";
import { SubtemaSeleccionadoContextProvider } from "../src/context/SubtemaSeleccionadoContext";
import { EjercicioSeleccionadoContextProvider } from "../src/context/EjercicioSeleccionadoContext";
import { PreguntaSeleccionadoContextProvider } from "../src/context/PreguntaSeleccionadoContext";

export default function App() {
  const { isAuthenticated, usuarioDetallesKeycloak, cerrarSesionKeycloak } = useSesionKeycloak();
  const { usuarioDetalles, setUsuarioDetalles } = useSesionUsuario();
  console.log("Antes de setear usuarioDetalles");
  setUsuarioDetalles(usuarioDetallesKeycloak);
  console.log("Después de setear usuarioDetalles");
  console.log(usuarioDetalles);

  return (
    <TemaSeleccionadoContextProvider>
      <SubtemaSeleccionadoContextProvider>
        <EjercicioSeleccionadoContextProvider>
          <PreguntaSeleccionadoContextProvider>
            {/* {usuarioDetalles ? (
              <PaginaPrincipal />

            ) : (
              <PaginaInicio />
            )} */}
            
            {(isAuthenticated && usuarioDetallesKeycloak) || (usuarioDetalles) ? (
              // <div>
              //   <h1>Bienvenido usuario con aerobase {usuarioDetallesKeycloak.nombre} {usuarioDetallesKeycloak.apellido}</h1>
              //   {/* <h1>Bienvenido usuario normal {usuarioDetalles.detallesPersona.nombres} {usuarioDetalles.detallesPersona.apellidos}</h1> */}
              //   <p>Email: {usuarioDetallesKeycloak.email}</p>
              //   <p>Rol: {usuarioDetallesKeycloak.rol}</p>
              //   <button
              //     onClick={cerrarSesionKeycloak}
              //     className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              //   >
              //     Cerrar Sesión
              //   </button>
              // </div>
              <PaginaPrincipal />
            ) : (
              <PaginaInicio />
            )}
          </PreguntaSeleccionadoContextProvider>
        </EjercicioSeleccionadoContextProvider>
      </SubtemaSeleccionadoContextProvider>
    </TemaSeleccionadoContextProvider>
  );
}