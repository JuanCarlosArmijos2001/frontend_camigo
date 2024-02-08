// import React, { useEffect, useState } from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import { useSesionUsuario } from "../../context/SesionUsuarioContext";
// import VisualizarContenido from "./visualizarContenido/VisualizarContenido";
// import PaginaPrincipalDocente from "./paginaPrincipalDocente/PaginaPrincipalDocente";
// import PaginaPrincipalAdmin from "./paginaPrincipalAdmin.js/PaginaPrincipalAdmin";
// import "../../assets/styles/components/main/main.css";

// export default function Main() {
//   const { usuarioDetalles } = useSesionUsuario();

//   useEffect(() => {
//     console.log("Sesión en Main: ", usuarioDetalles);
//   }, [usuarioDetalles]);

//   return (
//     <Container className="contenedorPD">
//       <Row>
//         <Col xs={12} className="colPagDocenteVisContenido">
//           {usuarioDetalles && (
//             <>
//               {usuarioDetalles.detallesRol.tipo === "docente" && <PaginaPrincipalDocente />}
//               {usuarioDetalles.detallesRol.tipo === "estudiante" && <VisualizarContenido />}
//               {usuarioDetalles.detallesRol.tipo === "administrador" && <PaginaPrincipalAdmin />}
//             </>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };
//---------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import Home from "./visualizarContenido/Home";
import "../../assets/styles/components/main/main.css";

export default function Main() {
  const { usuarioDetalles } = useSesionUsuario();

  return (
    <div>
      {usuarioDetalles && (
        <div>
          <Home/>
        </div>
      )}
    </div>
  );
}

