import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import Main from '../components/main/Main';
import PaginaInicio from "../components/administrarSesion/PaginaInicio";
import NaveBar from "../components/header/NaveBar";
import { useSesionUsuario } from "../context/SesionUsuarioContext";
import { TemaSeleccionadoContextProvider } from "../context/TemaSeleccionadoContext";
import { SubtemaSeleccionadoContextProvider } from "../context/SubtemaSeleccionadoContext";
import { EjercicioSeleccionadoContextProvider } from "../context/EjercicioSeleccionadoContext";
import { PreguntaSeleccionadoContextProvider } from "../context/PreguntaSeleccionadoContext";
import "../assets/styles/components/admin.css";

export default function Admin() {
  const { usuarioDetalles } = useSesionUsuario();
  return (
    <Container className="admin" fluid> 
      {usuarioDetalles ? (
        <>
          <Row>
            <Col sm={12} className="columna">
              <header id="header">
                <NaveBar />
              </header>
            </Col>
          </Row>
          <Row className="filaMain">
            <Col sm={12} className="columna">
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
            </Col>
          </Row>
        </>
      ) : (
        <Row className="filaPaginaInicio">
          <Col sm={12} className="columna">
            <PaginaInicio />
          </Col>
        </Row>
      )}
    </Container>
  );
};