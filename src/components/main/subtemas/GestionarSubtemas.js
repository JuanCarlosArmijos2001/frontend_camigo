import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col, Modal, Table } from "react-bootstrap";
import Cargando from "../../utilities/Cargando";
import ModalRegistrarSubtema from "./ModalRegistrarSubtema";
import ModalEditarSubtema from "./ModalEditarSubtema";
import Card from 'react-bootstrap/Card';
import Imagen from '../../../assets/images/crear.svg';
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";


const GestionarSubtemas = () => {
  const [subtemas, setSubtemas] = useState([]);
  const { temaSeleccionado } = useTemaSeleccionado();
  const { subtemaSeleccionado, actualizarSubtemaSeleccionado } = useSubtemaSeleccionado();
  const { actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
  const { actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
  const [term, setTerm] = useState('');
  const [existeSubtemas, setExisteSubtemas] = useState(false);
  const [historialCambios, setHistorialCambios] = useState([]);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const { usuarioDetalles } = useSesionUsuario();

  useEffect(() => {
    cargarSubtemas();
  }, [temaSeleccionado]);

  const cargarSubtemas = () => {
    axios
      .post("http://localhost:5000/subtemas/listarSubtemas", {
        idTema: temaSeleccionado.idTema,
        idUsuario: usuarioDetalles.id,
        mensaje: "subtemas",
      })
      .then((response) => {
        if (response.data.en === 1) {
          setSubtemas(response.data.subtemas);
          setExisteSubtemas(true);
        } else {
          console.log("Hubo un problema al cargar los subtemas");
          setExisteSubtemas(false);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los subtemas:", error);
      });
  };

  const activarDesactivarSubtema = () => {
    if (subtemaSeleccionado) {
      const nuevoEstado = subtemaSeleccionado.estado === 1 ? -1 : 1;

      axios
        .post("http://localhost:5000/subtemas/activarDesactivarSubtema", {
          id: subtemaSeleccionado.idSubtema,
          estado: nuevoEstado,
        })
        .then((response) => {
          if (response.data.en === 1) {
            console.log("Estado del subtema cambiado con éxito");
            const usuarioId = usuarioDetalles.id;
            const estadoMensaje = nuevoEstado === 1 ? "activo" : "inactivo";
            axios
              .post("http://localhost:5000/historial/registrarCambio", {
                tipoEntidad: "subtema",
                idSubtema: subtemaSeleccionado.idSubtema,
                detalles: `${usuarioDetalles.detallesPersona.nombres} cambió el estado del subtema "${cleanHtmlTags(subtemaSeleccionado.titulo)}" a ${estadoMensaje}`,
                idUsuario: usuarioId,
              })
              .then((historialResponse) => {
                if (historialResponse.data.en === 1) {
                  console.log("Cambio registrado en el historial");
                  cargarSubtemas();
                } else {
                  console.log("No se pudo registrar el cambio en el historial");
                }
              })
              .catch((error) => {
                console.error("Error al registrar el cambio en el historial:", error);
              });
          } else {
            console.log("No se pudo cambiar el estado del subtema");
          }
        })
        .catch((error) => {
          console.error("Error al cambiar el estado del subtema:", error);
        });
    }
  };


  const cleanHtmlTags = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.body.textContent || "";
  };

  const getButtonText = () => {
    if (subtemaSeleccionado === null) {
      return subtemas[0].estado === 1 ? "Desactivar" : "Activar";
    } else if (subtemaSeleccionado.estado === 1) {
      return "Desactivar";
    } else {
      return "Activar";
    }
  };

  const filteredSubtemas = term
    ? subtemas.filter(subtema =>
      subtema.titulo.toLowerCase().includes(term.toLowerCase())
    )
    : subtemas;


  const cargarHistorialCambios = () => {
    if (subtemaSeleccionado) {
      axios
        .post("http://localhost:5000/historial/listarCambios", {
          idEntidad: subtemaSeleccionado.idSubtema,
          tipoEntidad: "subtema",
        })
        .then((response) => {
          if (response.data.en === 1) {
            setHistorialCambios(response.data.cambios);
            setShowHistorialModal(true);
          } else {
            console.log("No se encontraron cambios para este subtema");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el historial de cambios:", error);
        });
    }
  };

  return (
    <Container>
      {existeSubtemas ? (
        <Row>
          <Col xs={12}>
            <div className="contenedorPrincipal">
              <div className="informacionTema">
                <h1>Subtemas</h1>
                <p>Los subtemas con fondo color rojo están desactivados</p>
                <p>Es necesario seleccionar un subtema para editar o para cambiar su estado de activo a inactivo..</p>
              </div>
            </div>
          </Col>
          <Col xs={12}>
            <div className="contenedorTabla">
              <Form.Group controlId="formBuscar">
                <Form.Control
                  type="text"
                  placeholder="Buscar subtema"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </Form.Group>
              <br />
              <table className="tablaTemas">
                <thead>
                  <tr>
                    <th className="tituloTabla">Subtemas existentes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubtemas.length > 0 ? (
                    filteredSubtemas.map((subtema, index) => (
                      <tr
                        key={index}
                        onClick={() => {
                          actualizarSubtemaSeleccionado(subtema);
                          actualizarEjercicioSeleccionado(null);
                          actualizarPreguntaSeleccionado(null);
                        }}
                        className={`
                          ${subtema.estado === -1 ? "redRow" : ""}
                          ${subtemaSeleccionado && subtemaSeleccionado.idSubtema === subtema.idSubtema
                            ? "selectedRow"
                            : ""}
                        `}
                      >
                        <td>{cleanHtmlTags(subtema.titulo)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="1">No se encontraron subtemas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Col>
          <Col xs={12}>
            <div className="botonesDerecha d-flex justify-content-center align-items-center">
              <ModalRegistrarSubtema cargarSubtemas={cargarSubtemas} subtemas={subtemas} />
              <ModalEditarSubtema
                cargarSubtemas={cargarSubtemas}
                subtemaParaEditar={subtemaSeleccionado}
              />
              <Button
                variant="danger"
                className="botonActivarDesactivarTema"
                disabled={!subtemaSeleccionado}
                onClick={activarDesactivarSubtema}
              >
                {getButtonText()}
              </Button>
              <Button
                variant="info"
                onClick={cargarHistorialCambios}
                disabled={!subtemaSeleccionado}
              >
                Historial
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={12}>
            <Card style={{ width: '18rem', marginTop: '75px', marginLeft: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Card.Img variant="top" src={Imagen} />
              <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card.Title>Da el primer paso: ¡Crea el primer subtema en este tema emocionante!</Card.Title>
                <Card.Text style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <ModalRegistrarSubtema cargarSubtemas={cargarSubtemas} subtemas={subtemas} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal para el Historial de Cambios */}
      <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)} style={{zIndex:1500}}>
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

export default GestionarSubtemas;
