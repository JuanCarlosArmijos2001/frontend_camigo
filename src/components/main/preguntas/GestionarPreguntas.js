// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
// import "../../../assets/styles/components/main/temas/gestionarTemas.css";
// import Cargando from "../../utilities/Cargando";
// import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
// import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
// import ModalRegistrarPregunta from "./ModalRegistrarPregunta";
// import ModalEditarPregunta from "./ModalEditarPregunta";
// import { useSesionUsuario } from "../../../context/SesionUsuarioContext"; // Importa el contexto de sesión de usuario
// import Imagen from "../../../assets/images/crear.svg";

// const GestionarPreguntas = () => {
//     const [preguntas, setPreguntas] = useState([]);
//     const { ejercicioSeleccionado } = useEjercicioSeleccionado();
//     const { preguntaSeleccionado, actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
//     const [term, setTerm] = useState("");
//     const [existePreguntas, setExistePreguntas] = useState(false);
//     const { usuarioDetalles } = useSesionUsuario(); // Usa el hook del contexto de sesión de usuario

//     useEffect(() => {
//         cargarPreguntas();
//     }, [ejercicioSeleccionado]);

//     const cargarPreguntas = () => {
//         axios
//             .post("http://localhost:5000/preguntas/listarPreguntas", {
//                 idEjercicio: ejercicioSeleccionado.id,
//                 mensaje: "preguntas",
//             })
//             .then((response) => {
//                 if (response.data.en === 1) {
//                     setPreguntas(response.data.preguntas);
//                     setExistePreguntas(true);
//                 } else {
//                     console.log("Hubo un problema al cargar las preguntas");
//                     setExistePreguntas(false);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error al obtener las preguntas:", error);
//             });
//     };

//     const activarDesactivarPregunta = () => {
//         if (preguntaSeleccionado) {
//             const nuevoEstado = preguntaSeleccionado.estado === 1 ? -1 : 1;
//             axios
//                 .post("http://localhost:5000/preguntas/activarDesactivarPregunta", {
//                     id: preguntaSeleccionado.id,
//                     estado: nuevoEstado,
//                 })
//                 .then((response) => {
//                     if (response.data.en === 1) {
//                         cargarPreguntas();
//                         // Registro del cambio en el historial
//                         const personaId = usuarioDetalles ? usuarioDetalles.detallesPersona.id : null;
//                         const estadoMensaje = nuevoEstado === 1 ? "activo" : "inactivo";
//                         axios
//                             .post("http://localhost:5000/historial/registrarCambio", {
//                                 tipoEntidad: "pregunta",
//                                 idPregunta: preguntaSeleccionado.id,
//                                 detalles: `${usuarioDetalles.detallesPersona.nombres} cambió el estado de la pregunta "${cleanHtmlTags(preguntaSeleccionado.enunciado)}" a ${estadoMensaje}`,
//                                 personaId: personaId,
//                             })
//                             .then((historialResponse) => {
//                                 if (historialResponse.data.en === 1) {
//                                     console.log("Cambio registrado en el historial");
//                                 } else {
//                                     console.log("No se pudo registrar el cambio en el historial");
//                                 }
//                             })
//                             .catch((error) => {
//                                 console.error("Error al registrar el cambio en el historial:", error);
//                             });
//                     } else {
//                         console.log("No se pudo cambiar el estado de la pregunta");
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error al cambiar el estado de la pregunta:", error);
//                 });
//         }
//     };

//     const cleanHtmlTags = (htmlContent) => {
//         const doc = new DOMParser().parseFromString(htmlContent, "text/html");
//         return doc.body.textContent || "";
//     };

//     const getButtonText = () => {
//         if (preguntaSeleccionado === null) {
//             return preguntas[0].estado === 1 ? "Desactivar" : "Activar";
//         } else if (preguntaSeleccionado.estado === 1) {
//             return "Desactivar";
//         } else {
//             return "Activar";
//         }
//     };

//     const filteredPreguntas = term
//         ? preguntas.filter((pregunta) =>
//             pregunta.enunciado && pregunta.enunciado.toLowerCase().includes(term.toLowerCase())
//         )
//         : preguntas;

//     return (
//         <Container>
//             {existePreguntas ? (
//                 <Row>
//                     <Col xs={12}>
//                         <div className="contenedorPrincipal">
//                             <div className="informacionTema">
//                                 <h1>Preguntas de control</h1>
//                                 <p>Las preguntas con fondo color rojo están desactivadas</p>
//                                 <p>Es necesario seleccionar una pregunta de control para editar o para activar/desactivar.</p>
//                             </div>
//                         </div>
//                     </Col>
//                     <Col xs={12}>
//                         <div className="contenedorTabla">
//                             <Form.Group controlId="formBuscar">
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Buscar pregunta"
//                                     value={term}
//                                     onChange={(e) => setTerm(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <br />
//                             <table className="tablaTemas">
//                                 <thead>
//                                     <tr>
//                                         <th className="tituloTabla">Preguntas de control existentes</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredPreguntas.length > 0 ? (
//                                         filteredPreguntas.map((pregunta, index) => (
//                                             <tr
//                                                 key={index}
//                                                 onClick={() => actualizarPreguntaSeleccionado(pregunta)}
//                                                 className={`
//                           ${pregunta.estado === -1 ? "redRow" : ""}
//                           ${preguntaSeleccionado && preguntaSeleccionado.id === pregunta.id
//                                                         ? "selectedRow"
//                                                         : ""}
//                         `}
//                                             >
//                                                 <td>{cleanHtmlTags(pregunta.enunciado)}</td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="1">No se encontraron preguntas</td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </Col>
//                     <Col xs={12}>
//                         <div className="botonesDerecha">
//                             <ModalRegistrarPregunta cargarPreguntas={cargarPreguntas} preguntas={preguntas} />
//                             <ModalEditarPregunta
//                                 cargarPreguntas={cargarPreguntas}
//                                 preguntaParaEditar={preguntaSeleccionado}
//                             />
//                             <Button
//                                 variant="danger"
//                                 className="botonActivarDesactivarTema"
//                                 disabled={!preguntaSeleccionado}
//                                 onClick={activarDesactivarPregunta}
//                             >
//                                 {getButtonText()}
//                             </Button>
//                         </div>
//                     </Col>
//                 </Row>
//             ) : (
//                 <Row>
//                     <Col xs={12}>
//                         <Card style={{ width: '18rem', marginTop: '75px', marginLeft: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                             <Card.Img variant="top" src={Imagen} />
//                             <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                                 <Card.Title>Sé pionero: Haz de este ejercicio un espacio lleno de preguntas de control interesantes.</Card.Title>
//                                 <Card.Text style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
//                                     <ModalRegistrarPregunta cargarPreguntas={cargarPreguntas} preguntas={preguntas} />
//                                 </Card.Text>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             )}
//         </Container>
//     );
// };

// export default GestionarPreguntas;
//------------------------------------------------------------------------------------------------------------
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col, Card, Modal, Table } from "react-bootstrap";
import "../../../assets/styles/components/main/temas/gestionarTemas.css";
import Cargando from "../../utilities/Cargando";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import ModalRegistrarPregunta from "./ModalRegistrarPregunta";
import ModalEditarPregunta from "./ModalEditarPregunta";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import Imagen from "../../../assets/images/crear.svg";

const GestionarPreguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();
    const { preguntaSeleccionado, actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
    const [term, setTerm] = useState("");
    const [existePreguntas, setExistePreguntas] = useState(false);
    const [historialCambios, setHistorialCambios] = useState([]);
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const { usuarioDetalles } = useSesionUsuario();

    useEffect(() => {
        cargarPreguntas();
    }, [ejercicioSeleccionado]);

    const cargarPreguntas = () => {
        axios
            .post("http://localhost:5000/preguntas/listarPreguntas", {
                idEjercicio: ejercicioSeleccionado.idEjercicio,
                idUsuario: usuarioDetalles.id,
                mensaje: "preguntas",
            })
            .then((response) => {
                if (response.data.en === 1) {
                    setPreguntas(response.data.preguntas);
                    setExistePreguntas(true);
                } else {
                    console.log("Hubo un problema al cargar las preguntas");
                    setExistePreguntas(false);
                }
            })
            .catch((error) => {
                console.error("Error al obtener las preguntas:", error);
            });
    };

    const activarDesactivarPregunta = () => {
        if (preguntaSeleccionado) {
            const nuevoEstado = preguntaSeleccionado.estado === 1 ? -1 : 1;
            axios
                .post("http://localhost:5000/preguntas/activarDesactivarPregunta", {
                    id: preguntaSeleccionado.idPregunta,
                    estado: nuevoEstado,
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        cargarPreguntas();
                        // Registro del cambio en el historial
                        const usuarioId = usuarioDetalles.id;
                        const estadoMensaje = nuevoEstado === 1 ? "activo" : "inactivo";
                        axios
                            .post("http://localhost:5000/historial/registrarCambio", {
                                tipoEntidad: "pregunta",
                                idPregunta: preguntaSeleccionado.idPregunta,
                                detalles: `${usuarioDetalles.detallesPersona.nombres} cambió el estado de la pregunta "${cleanHtmlTags(preguntaSeleccionado.enunciado)}" a ${estadoMensaje}`,
                                idUsuario: usuarioId,
                            })
                            .then((historialResponse) => {
                                if (historialResponse.data.en === 1) {
                                    console.log("Cambio registrado en el historial");
                                } else {
                                    console.log("No se pudo registrar el cambio en el historial");
                                }
                            })
                            .catch((error) => {
                                console.error("Error al registrar el cambio en el historial:", error);
                            });
                    } else {
                        console.log("No se pudo cambiar el estado de la pregunta");
                    }
                })
                .catch((error) => {
                    console.error("Error al cambiar el estado de la pregunta:", error);
                });
        }
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const getButtonText = () => {
        if (preguntaSeleccionado === null) {
            return preguntas[0].estado === 1 ? "Desactivar" : "Activar";
        } else if (preguntaSeleccionado.estado === 1) {
            return "Desactivar";
        } else {
            return "Activar";
        }
    };

    const filteredPreguntas = term
        ? preguntas.filter((pregunta) =>
            pregunta.enunciado && pregunta.enunciado.toLowerCase().includes(term.toLowerCase())
        )
        : preguntas;

    const cargarHistorialCambios = () => {
        if (preguntaSeleccionado) {
            axios
                .post("http://localhost:5000/historial/listarCambios", {
                    idEntidad: preguntaSeleccionado.idPregunta,
                    tipoEntidad: "pregunta",
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        setHistorialCambios(response.data.cambios);
                        setShowHistorialModal(true);
                    } else {
                        console.log("No se encontraron cambios para esta pregunta");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener el historial de cambios:", error);
                });
        }
    };

    return (
        <Container>
            {existePreguntas ? (
                <Row>
                    <Col xs={12}>
                        <div className="contenedorPrincipal">
                            <div className="informacionTema">
                                <h1>Preguntas de control</h1>
                                <p>Las preguntas con fondo color rojo están desactivadas</p>
                                <p>Es necesario seleccionar una pregunta para editar o para cambiar su estado de activo a inactivo.</p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="contenedorTabla">
                            <Form.Group controlId="formBuscar">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar pregunta"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <table className="tablaTemas">
                                <thead>
                                    <tr>
                                        <th className="tituloTabla">Preguntas de control existentes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPreguntas.length > 0 ? (
                                        filteredPreguntas.map((pregunta, index) => (
                                            <tr
                                                key={index}
                                                onClick={() => actualizarPreguntaSeleccionado(pregunta)}
                                                className={`
                                                  ${pregunta.estado === -1 ? "redRow" : ""}
                                                  ${preguntaSeleccionado && preguntaSeleccionado.idPregunta === pregunta.idPregunta
                                                        ? "selectedRow"
                                                        : ""}
                                                `}
                                            >
                                                <td>{cleanHtmlTags(pregunta.enunciado)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="1">No se encontraron preguntas</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="botonesDerecha d-flex justify-content-center align-items-center">
                            <ModalRegistrarPregunta cargarPreguntas={cargarPreguntas} preguntas={preguntas} />
                            <ModalEditarPregunta
                                cargarPreguntas={cargarPreguntas}
                                preguntaParaEditar={preguntaSeleccionado}
                            />
                            <Button
                                variant="danger"
                                className="botonActivarDesactivarTema"
                                disabled={!preguntaSeleccionado}
                                onClick={activarDesactivarPregunta}
                            >
                                {getButtonText()}
                            </Button>
                            <Button
                                variant="info"
                                onClick={cargarHistorialCambios}
                                disabled={!preguntaSeleccionado}
                            >
                                Historial
                            </Button>
                        </div>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col xs={12}>
                        <Card
                            style={{
                                width: "18rem",
                                marginTop: "75px",
                                marginLeft: "150px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Card.Img variant="top" src={Imagen} />
                            <Card.Body
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Card.Title>
                                    Sé pionero: Haz de este ejercicio un espacio lleno de preguntas de control
                                    interesantes.
                                </Card.Title>
                                <Card.Text style={{ flex: 1, display: "flex", alignItems: "center" }}>
                                    <ModalRegistrarPregunta cargarPreguntas={cargarPreguntas} preguntas={preguntas} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
            {/* Historial Modal */}
            <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)} style={{zIndex:1500}}>
                <Modal.Header closeButton>
                    <Modal.Title>Historial de Cambios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {historialCambios.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Detalle del Cambio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historialCambios.map((cambio, index) => (
                                    <tr key={index}>
                                        <td>{cambio.fecha}</td>
                                        <td>{cambio.detalles}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No hay cambios registrados para esta pregunta.</p>
                    )}
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

export default GestionarPreguntas;

