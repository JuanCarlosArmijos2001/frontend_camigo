import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import VisualizarContenido from "./visualizarContenido/VisualizarContenido";
import PaginaPrincipalDocente from "./paginaPrincipalDocente/PaginaPrincipalDocente";
import PaginaPrincipalAdmin from "./paginaPrincipalAdmin.js/PaginaPrincipalAdmin";
import "../../assets/styles/components/main/main.css";

export default function Main() {
  const { usuarioDetalles } = useSesionUsuario();

  useEffect(() => {
    console.log("Sesión en Main: ", usuarioDetalles);
  }, [usuarioDetalles]);

  return (
    <Container className="contenedorPD">
      <Row>
        <Col xs={12} className="colPagDocenteVisContenido">
          {usuarioDetalles && (
            <>
              {usuarioDetalles.detallesRol.tipo === "docente" && <PaginaPrincipalDocente />}
              {usuarioDetalles.detallesRol.tipo === "estudiante" && <VisualizarContenido />}
              {usuarioDetalles.detallesRol.tipo === "administrador" && <PaginaPrincipalAdmin />}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

