import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col, Modal, Table } from "react-bootstrap";
import Cargando from "../../utilities/Cargando";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import ModalRegistrarTema from "./ModalRegistrarTema";
import ModalEditarTema from "./ModalEditarTema";
import "../../../assets/styles/components/main/temas/gestionarTemas.css";

const GestionarTemas = () => {
  const [temas, setTemas] = useState([]);
  const { temaSeleccionado, actualizarTemaSeleccionado } = useTemaSeleccionado();
  const { actualizarSubtemaSeleccionado } = useSubtemaSeleccionado();
  const { actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
  const { actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
  const { usuarioDetalles } = useSesionUsuario();
  const [term, setTerm] = useState('');
  const [historialCambios, setHistorialCambios] = useState([]);
  const [showHistorialModal, setShowHistorialModal] = useState(false);

  useEffect(() => {
    cargarTemas();
  }, []);

  const cleanHtmlTags = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.body.textContent || "";
  };

  const cargarTemas = () => {
    const parametros = {
      idUsuario: usuarioDetalles.id,
      mensaje: "temas",
    };

    axios
      .post("http://localhost:5000/temas/listarTemas", parametros)
      .then((response) => {
        if (response.data.en === 1) {
          setTemas(response.data.temas);
        } else {
          console.log("Hubo un problema al cargar los temas");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los temas:", error);
      });
  };

  const cargarHistorialCambios = () => {
    if (temaSeleccionado) {
      axios
        .post("http://localhost:5000/historial/listarCambios", {
          idEntidad: temaSeleccionado.idTema,
          tipoEntidad: "tema",
        })
        .then((response) => {
          if (response.data.en === 1) {
            setHistorialCambios(response.data.cambios);
            setShowHistorialModal(true);
          } else {
            console.log("No se encontraron cambios para este tema");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el historial de cambios:", error);
        });
    }
  };

  const activarDesactivarTema = () => {
    if (temaSeleccionado) {
      const nuevoEstado = temaSeleccionado.estado === 1 ? -1 : 1;

      axios
        .post("http://localhost:5000/temas/activarDesactivarTema", {
          id: temaSeleccionado.idTema,
          estado: nuevoEstado,
        })
        .then((response) => {
          if (response.data.en === 1) {
            console.log("Estado del tema cambiado con éxito");
            const usuarioId = usuarioDetalles.id;
            console.log("usuarioId en tema", usuarioId)
            const estadoMensaje = nuevoEstado === 1 ? "activo" : "inactivo";
            axios
              .post("http://localhost:5000/historial/registrarCambio", {
                tipoEntidad: "tema",
                idTema: temaSeleccionado.idTema,
                detalles: `${usuarioDetalles.detallesPersona.nombres} cambió el estado del tema "${cleanHtmlTags(temaSeleccionado.titulo)}" a ${estadoMensaje}`,
                idUsuario: usuarioId,
              })
              .then((historialResponse) => {
                if (historialResponse.data.en === 1) {
                  console.log("Cambio registrado en el historial del activar/desactivar tema");
                  cargarTemas();
                } else {
                  console.log("No se pudo registrar el cambio en el historial del activar/desactivar tema");
                }
              })
              .catch((error) => {
                console.error("Error al registrar el cambio en el historial del activar/desactivar tema", error);
              });
          } else {
            console.log("No se pudo cambiar el estado del tema");
          }
        })
        .catch((error) => {
          console.error("Error al cambiar el estado del tema:", error);
        });
    }
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
                <p>Es necesario seleccionar un tema para editar o para cambiar su estado de activo a inactivo.</p>
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
                        onClick={() => {
                          actualizarTemaSeleccionado(tema);
                          actualizarSubtemaSeleccionado(null);
                          actualizarEjercicioSeleccionado(null);
                          actualizarPreguntaSeleccionado(null);
                        }}
                        className={`
                          ${tema.estado === -1 ? "redRow" : ""}
                          ${temaSeleccionado && temaSeleccionado.idTema === tema.idTema
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
            <div className="botonesDerecha d-flex justify-content-center align-items-center">
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
              <Button
                variant="info"
                onClick={cargarHistorialCambios}
                disabled={!temaSeleccionado}
              >
                Historial
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        <Cargando />
      )}

      {/* Modal para el Historial de Cambios */}
      <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)} style={{ zIndex: 1500 }}>
        <Modal.Header closeButton>
          <Modal.Title>Historial de Cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {historialCambios.map((cambio, index) => (
                <tr key={index}>
                  <td>{new Date(cambio.fecha).toLocaleString()}</td>
                  <td>{cambio.detalles}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistorialModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionarTemas;
