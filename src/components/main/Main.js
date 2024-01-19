// import React, { useEffect } from "react";
// import "../../assets/styles/components/main/main.css"
// import { useSesionUsuario } from "../../context/SesionUsuarioContext";
// import VisualizarContenido from "./visualizarContenido/VisualizarContenido";
// import PaginaPrincipalDocente from "./paginaPrincipalDocente/PaginaPrincipalDocente";

// export default function Main() {
//   const { usuarioDetalles } = useSesionUsuario();

//   useEffect(() => {
//     console.log("Sesión en Main: ", usuarioDetalles)
//   }, [usuarioDetalles]);

//   return (
//     <div className="contenedorPD">
//       {usuarioDetalles && (
//         <>
//           {usuarioDetalles.detallesRol.tipo === "docente" && <PaginaPrincipalDocente />}
//           {usuarioDetalles.detallesRol.tipo === "estudiante" && <VisualizarContenido />}
//         </>
//       )}
//     </div>
//   );
// }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import VisualizarContenido from "./visualizarContenido/VisualizarContenido";
import PaginaPrincipalDocente from "./paginaPrincipalDocente/PaginaPrincipalDocente";
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
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

