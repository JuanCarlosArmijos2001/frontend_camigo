import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container, Button, Row, Col } from "react-bootstrap";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import "../../assets/styles/components/header/NaveBar.css";
import ModalAdministrarSesion from "../administrarSesion/ModalAdministrarSesion";

export default function NaveBar() {
  const { usuarioDetalles, cerrarSesion } = useSesionUsuario();

  useEffect(() => {
    console.log("Sesión en NaveBar: ", usuarioDetalles);
  }, [usuarioDetalles]);

  const cerrarSesionBackend = () => {
    cerrarSesion();
  };

  return (
        <Container className="contenedorPrincipalNB" fluid>
          <Row className="filaNavBar">
            <Col xs={4} >
              <h1 className="tituloNavBar">C'amigo</h1>
            </Col>
            <Col xs={4}>
              {usuarioDetalles && usuarioDetalles.detallesPersona ? (
                <h1 className="nombreUsuario">¡Bienvenido de nuevo, {usuarioDetalles.detallesPersona.nombres}!</h1>
              ) : (
                <ModalAdministrarSesion />
              )}
            </Col>
            <Col xs={4} className="text-center">
              {usuarioDetalles && usuarioDetalles.detallesPersona ? (
                <Button variant="danger" onClick={cerrarSesionBackend} id="botonCerrarSesion">
                  Cerrar sesión
                </Button>
              ) : null}
            </Col>
          </Row>
        </Container>
  );
};
