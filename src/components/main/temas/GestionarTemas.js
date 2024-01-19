// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Form } from "react-bootstrap";
// import "../../../assets/styles/components/main/temas/gestionarTemas.css";
// import Cargando from "../../utilities/Cargando";
// import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
// import ModalRegistrarTema from "./ModalRegistrarTema";
// import ModalEditarTema from "./ModalEditarTema";

// const GestionarTemas = () => {
//   const [temas, setTemas] = useState([]);
//   const { temaSeleccionado, actualizarTemaSeleccionado } = useTemaSeleccionado();
//   const [term, setTerm] = useState('');

//   useEffect(() => {
//     cargarTemas();
//   }, []);


//   const cargarTemas = () => {
//     axios
//       .get("http://localhost:5000/temas/listarTemas")
//       .then((response) => {
//         if (response.data.en === 1) {
//           setTemas(response.data.temas);
//         } else {
//           console.log("Hubo un problema al cargar los temas");
//         }
//       })
//       .catch((error) => {
//         console.error("Error al obtener los temas:", error);
//       });
//   };

//   const activarDesactivarTema = () => {
//     if (temaSeleccionado) {
//       const nuevoEstado = temaSeleccionado.estado === 1 ? -1 : 1;
//       axios
//         .post("http://localhost:5000/temas/activarDesactivarTema", {
//           id: temaSeleccionado.id,
//           estado: nuevoEstado,
//         })
//         .then((response) => {
//           if (response.data.en === 1) {
//             cargarTemas();
//           } else {
//             console.log("No se pudo cambiar el estado del tema");
//           }
//         })
//         .catch((error) => {
//           console.error("Error al cambiar el estado del tema:", error);
//         });
//     }
//   };

//   const cleanHtmlTags = (htmlContent) => {
//     const doc = new DOMParser().parseFromString(htmlContent, "text/html");
//     return doc.body.textContent || "";
//   };

//   const getButtonText = () => {
//     if (temaSeleccionado === null) {
//       return temas[0].estado === 1 ? "Desactivar" : "Activar";
//     } else if (temaSeleccionado.estado === 1) {
//       return "Desactivar";
//     } else {
//       return "Activar";
//     }
//   };

//   const filteredTemas = term
//     ? temas.filter(tema =>
//       tema.titulo.toLowerCase().includes(term.toLowerCase())
//     )
//     : temas;


//   return (
//     <div>
//       {temas.length > 0 ? (
//         <div className="contenedorPrincipal">
//           <div className="informacionTema">
//             <h1>Temas</h1>
//             <p>Los temas con fondo color rojo están desactivados</p>
//             <p>Es necesario seleccionar un tema para editar o para activar/desactivar.</p>
//           </div>
//           <div className="contenedorTabla">
//             <Form.Group controlId="formBuscar">
//               <Form.Control
//                 type="text"
//                 placeholder="Buscar tema"
//                 value={term}
//                 onChange={(e) => setTerm(e.target.value)}
//               />
//             </Form.Group>
//             <br />
//             <table className="tablaTemas">
//               <thead>
//                 <tr>
//                   <th className="tituloTabla">Temas existentes</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTemas.length > 0 ? (
//                   filteredTemas.map((tema, index) => (
//                     <tr
//                       key={index}
//                       onClick={() => actualizarTemaSeleccionado(tema)}
//                       className={`
//                         ${tema.estado === -1 ? "redRow" : ""}
//                         ${temaSeleccionado && temaSeleccionado.id === tema.id
//                           ? "selectedRow"
//                           : ""}
//                       `}
//                     >
//                       <td>{cleanHtmlTags(tema.titulo)}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="1">No se encontraron temas</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div className="botonesDerecha">
//             <ModalRegistrarTema cargarTemas={cargarTemas} temas={temas} />
//             <ModalEditarTema
//               cargarTemas={cargarTemas}
//               temaParaEditar={temaSeleccionado}
//             />
//             <Button
//               variant="danger"
//               className="botonActivarDesactivarTema"
//               disabled={!temaSeleccionado}
//               onClick={activarDesactivarTema}
//             >
//               {getButtonText()}
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <Cargando />
//       )}
//     </div>
//   );
// };

// export default GestionarTemas;

//----------- GestionarSubtemas.js ------------
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import "../../../assets/styles/components/main/temas/gestionarTemas.css";
import Cargando from "../../utilities/Cargando";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import ModalRegistrarTema from "./ModalRegistrarTema";
import ModalEditarTema from "./ModalEditarTema";

const GestionarTemas = () => {
  const [temas, setTemas] = useState([]);
  const { temaSeleccionado, actualizarTemaSeleccionado } = useTemaSeleccionado();
  const [term, setTerm] = useState('');

  useEffect(() => {
    cargarTemas();
  }, []);

  // const cargarTemas = () => {
  //   axios
  //     .get("http://localhost:5000/temas/listarTemas")
  //     .then((response) => {
  //       if (response.data.en === 1) {
  //         setTemas(response.data.temas);
  //       } else {
  //         console.log("Hubo un problema al cargar los temas");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error al obtener los temas:", error);
  //     });
  // };

  const cargarTemas = () => {
    const parametros = {
      mensaje: "temas",
    };

    axios
      .post("http://localhost:5000/temas/listarTemas", parametros)
      .then((response) => {
        if (response.data.en === 1) {
          console.log(response.data);
          setTemas(response.data.temas);
        } else {
          console.log("Hubo un problema al cargar los temas");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los temas:", error);
      });
  };

  const activarDesactivarTema = () => {
    if (temaSeleccionado) {
      const nuevoEstado = temaSeleccionado.estado === 1 ? -1 : 1;
      axios
        .post("http://localhost:5000/temas/activarDesactivarTema", {
          id: temaSeleccionado.id,
          estado: nuevoEstado,
        })
        .then((response) => {
          if (response.data.en === 1) {
            cargarTemas();
          } else {
            console.log("No se pudo cambiar el estado del tema");
          }
        })
        .catch((error) => {
          console.error("Error al cambiar el estado del tema:", error);
        });
    }
  };

  const cleanHtmlTags = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.body.textContent || "";
  };

  const getButtonText = () => {
    if (temaSeleccionado === null) {
      return temas[0].estado === 1 ? "Desactivar" : "Activar";
    } else if (temaSeleccionado.estado === 1) {
      return "Desactivar";
    } else {
      return "Activar";
    }
  };

  const filteredTemas = term
    ? temas.filter(tema =>
      tema.titulo.toLowerCase().includes(term.toLowerCase())
    )
    : temas;

  return (
    <Container>
      {temas.length > 0 ? (
        <Row>
          <Col xs={12}>
            <div className="contenedorPrincipal">
              <div className="informacionTema">
                <h1>Temas</h1>
                <p>Los temas con fondo color rojo están desactivados</p>
                <p>Es necesario seleccionar un tema para editar o para activar/desactivar.</p>
              </div>
            </div>
          </Col>
          <Col xs={12}>
            <div className="contenedorTabla">
              <Form.Group controlId="formBuscar">
                <Form.Control
                  type="text"
                  placeholder="Buscar tema"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </Form.Group>
              <br />
              <table className="tablaTemas">
                <thead>
                  <tr>
                    <th className="tituloTabla">Temas existentes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemas.length > 0 ? (
                    filteredTemas.map((tema, index) => (
                      <tr
                        key={index}
                        onClick={() => actualizarTemaSeleccionado(tema)}
                        className={`
                          ${tema.estado === -1 ? "redRow" : ""}
                          ${temaSeleccionado && temaSeleccionado.id === tema.id
                            ? "selectedRow"
                            : ""}
                        `}
                      >
                        <td>{cleanHtmlTags(tema.titulo)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="1">No se encontraron temas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Col>
          <Col xs={12}>
            <div className="botonesDerecha">
              <ModalRegistrarTema cargarTemas={cargarTemas} temas={temas} />
              <ModalEditarTema
                cargarTemas={cargarTemas}
                temaParaEditar={temaSeleccionado}
              />
              <Button
                variant="danger"
                className="botonActivarDesactivarTema"
                disabled={!temaSeleccionado}
                onClick={activarDesactivarTema}
              >
                {getButtonText()}
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        <Cargando />
      )}
    </Container>
  );
};

export default GestionarTemas;
