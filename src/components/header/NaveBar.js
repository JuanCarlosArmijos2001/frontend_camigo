// import React, { useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Navbar, Container, Button } from "react-bootstrap";
// import { useSesionUsuario } from "../../context/SesionUsuarioContext";
// import "../../assets/styles/components/header/NaveBar.css";
// import ModalAdministrarSesion from "../administrarSesion/ModalAdministrarSesion";

// export default function NaveBar() {
//   const { usuario, cerrarSesion } = useSesionUsuario();

//   useEffect(() => {
//   }, [usuario]);

//   const cerrarSesionBackend = () => {
//     cerrarSesion();
//   };

//   return (
//     <Navbar id="fondoNavBar">
//       <Container>
//         <h1 id="tituloNavBar">Camigo</h1>
//         {usuario ? (
//           <>
//             <span id="nombreUsuario">¡Bienvenido de nuevo! {usuario.email}</span>
//             <Button variant="danger" onClick={cerrarSesionBackend} id="botonCerrarSesion">
//               Cerrar sesión
//             </Button>
//           </>
//         ) : (
//           <ModalAdministrarSesion />
//         )}
//       </Container>
//     </Navbar>
//   );
// }
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Button, Spinner } from "react-bootstrap";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import "../../assets/styles/components/header/NaveBar.css";
import ModalAdministrarSesion from "../administrarSesion/ModalAdministrarSesion";

export default function NaveBar() {
  const { usuario, cerrarSesion } = useSesionUsuario();

  useEffect(() => {
  }, [usuario]);

  const cerrarSesionBackend = () => {
    cerrarSesion();
  };

  return (
    <Navbar id="fondoNavBar">
      <Container>
        <h1 id="tituloNavBar">Camigo</h1>
        {usuario ? (
          <>
            <span id="nombreUsuario">¡Bienvenido de nuevo!</span>
            <Button variant="danger" onClick={cerrarSesionBackend} id="botonCerrarSesion">
              Cerrar sesión
            </Button>
          </>
        ) : (
          <ModalAdministrarSesion />
        )}
      </Container>
    </Navbar>
  );
}
