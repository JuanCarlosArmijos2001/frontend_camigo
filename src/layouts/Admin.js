import React from "react";
import Main from '../components/main/Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TemaSeleccionadoContextProvider } from "../context/TemaSeleccionadoContext";
import { SubtemaSeleccionadoContextProvider } from "../context/SubtemaSeleccionadoContext";
import { EjercicioSeleccionadoContextProvider } from "../context/EjercicioSeleccionadoContext";
import { PreguntaSeleccionadoContextProvider } from "../context/PreguntaSeleccionadoContext";
import { SesionUsuarioContextProvider } from "../context/SesionUsuarioContext";
import NaveBar from "../components/header/NaveBar";

function Admin() {
  return (
    <>
      {<header id="header">
        <SesionUsuarioContextProvider>
          {<NaveBar />}
        </SesionUsuarioContextProvider>
      </header>}

      <main id="main">

        <TemaSeleccionadoContextProvider>
          <SubtemaSeleccionadoContextProvider>
            <EjercicioSeleccionadoContextProvider>
              <PreguntaSeleccionadoContextProvider>
                <Main />
              </PreguntaSeleccionadoContextProvider>
            </EjercicioSeleccionadoContextProvider>
          </SubtemaSeleccionadoContextProvider>
        </TemaSeleccionadoContextProvider>
      </main>

      {/* <footer id="footer">
      {/* <FooterContacto/>}
    </footer> */}
    </>
  );
}

export default Admin;