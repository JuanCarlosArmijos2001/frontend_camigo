// import React, { useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {Container, Button, Row, Col } from "react-bootstrap";
// import { useSesionUsuario } from "../../context/SesionUsuarioContext";
// import "../../assets/styles/components/header/NaveBar.css";
// import ModalAdministrarSesion from "../administrarSesion/ModalAdministrarSesion";

// export default function NaveBar() {
//   const { usuarioDetalles, cerrarSesion } = useSesionUsuario();

//   useEffect(() => {
//     console.log("Sesión en NaveBar: ", usuarioDetalles);
//   }, [usuarioDetalles]);

//   const cerrarSesionBackend = () => {
//     cerrarSesion();
//   };

//   return (
//         <Container className="contenedorPrincipalNB" fluid>
//           <Row className="filaNavBar">
//             <Col xs={4} >
//               <h1 className="tituloNavBar">C'amigo</h1>
//             </Col>
//             <Col xs={4}>
//               {usuarioDetalles && usuarioDetalles.detallesPersona ? (
//                 <h1 className="nombreUsuario">¡Bienvenido de nuevo, {usuarioDetalles.detallesPersona.nombres}!</h1>
//               ) : (
//                 <ModalAdministrarSesion />
//               )}
//             </Col>
//             <Col xs={4} className="text-center">
//               {usuarioDetalles && usuarioDetalles.detallesPersona ? (
//                 <Button variant="danger" onClick={cerrarSesionBackend} id="botonCerrarSesion">
//                   Cerrar sesión
//                 </Button>
//               ) : null}
//             </Col>
//           </Row>
//         </Container>
//   );
// };
//-----------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, Dropdown, ButtonGroup } from "react-bootstrap";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import ModalAdministrarSesion from "../administrarSesion/ModalAdministrarSesion";
import ModalEditarUsuario from "./ModalEditarUsuario";
import "../../assets/styles/components/header/NaveBar.css";

const NaveBar = () => {
  const { usuarioDetalles, cerrarSesion } = useSesionUsuario();
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  useEffect(() => {
    console.log("Sesión en NaveBar: ", usuarioDetalles);
  }, [usuarioDetalles]);

  const abrirModalEditar = () => {
    setMostrarModalEditar(true);
  };

  const cerrarModalEditar = () => {
    setMostrarModalEditar(false);
  };

  return (
    <Container className="contenedorPrincipalNB" fluid>
      <Row className="filaNavBar">
        <Col xs={4}>
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
            <ButtonGroup>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Opciones
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={abrirModalEditar}>Editar Perfil</Dropdown.Item>
                  <Dropdown.Item onClick={cerrarSesion}>Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          ) : null}
        </Col>
      </Row>

      <ModalEditarUsuario show={mostrarModalEditar} onHide={cerrarModalEditar} />
    </Container>
  );
};

export default NaveBar;
