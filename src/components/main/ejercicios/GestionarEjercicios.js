// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Form, Container, Row, Col, Modal, Table, Card } from "react-bootstrap";
// import "../../../assets/styles/components/main/temas/gestionarTemas.css";
// import Cargando from "../../utilities/Cargando";
// import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
// import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
// import ModalRegistrarEjercicio from "./ModalRegistrarEjercicio";
// import ModalEditarEjercicio from "./ModalEditarEjercicio";
// import { useSesionUsuario } from "../../../context/SesionUsuarioContext"; // Importa el contexto de sesión de usuario
// import Imagen from '../../../assets/images/crear.svg';

// const GestionarEjercicios = () => {
//     const [ejercicios, setEjercicios] = useState([]);
//     const { subtemaSeleccionado } = useSubtemaSeleccionado();
//     const { ejercicioSeleccionado, actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
//     const [term, setTerm] = useState('');
//     const [existeEjercicios, setExisteEjercicios] = useState(false);
//     const { usuarioDetalles } = useSesionUsuario(); // Usa el hook del contexto de sesión de usuario

//     useEffect(() => {
//         cargarEjercicios();
//     }, [subtemaSeleccionado]);

//     const cargarEjercicios = () => {
//         axios
//             .post("http://localhost:5000/ejercicios/listarEjercicios", {
//                 idSubtema: subtemaSeleccionado.id,
//                 mensaje: "ejercicios",
//             })
//             .then((response) => {
//                 if (response.data.en === 1) {
//                     setEjercicios(response.data.ejercicios);
//                     setExisteEjercicios(true);
//                 } else {
//                     console.log("Hubo un problema al cargar los ejercicios");
//                     setExisteEjercicios(false);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error al obtener los ejercicios:", error);
//             });
//     };

//     const activarDesactivarEjercicio = () => {
//         if (ejercicioSeleccionado) {
//             const nuevoEstado = ejercicioSeleccionado.estado === 1 ? -1 : 1;
//             axios
//                 .post("http://localhost:5000/ejercicios/activarDesactivarEjercicio", {
//                     id: ejercicioSeleccionado.id,
//                     estado: nuevoEstado,
//                 })
//                 .then((response) => {
//                     if (response.data.en === 1) {
//                         cargarEjercicios();
//                         // Registro del cambio en el historial
//                         const personaId = usuarioDetalles ? usuarioDetalles.detallesPersona.id : null;
//                         const estadoMensaje = nuevoEstado === 1 ? "activo" : "inactivo";
//                         axios
//                             .post("http://localhost:5000/historial/registrarCambio", {
//                                 tipoEntidad: "ejercicio",
//                                 idEjercicio: ejercicioSeleccionado.id,
//                                 detalles: `${usuarioDetalles.detallesPersona.nombres} cambió el estado del ejercicio "${cleanHtmlTags(ejercicioSeleccionado.titulo)}" a ${estadoMensaje}`,
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
//                         console.log("No se pudo cambiar el estado del ejercicio");
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error al cambiar el estado del ejercicio:", error);
//                 });
//         }
//     };

//     const cleanHtmlTags = (htmlContent) => {
//         const doc = new DOMParser().parseFromString(htmlContent, "text/html");
//         return doc.body.textContent || "";
//     };

//     const getButtonText = () => {
//         if (ejercicioSeleccionado === null) {
//             return ejercicios[0].estado === 1 ? "Desactivar" : "Activar";
//         } else if (ejercicioSeleccionado.estado === 1) {
//             return "Desactivar";
//         } else {
//             return "Activar";
//         }
//     };

//     const filteredEjercicios = term
//         ? ejercicios.filter(ejercicio =>
//             ejercicio.titulo.toLowerCase().includes(term.toLowerCase())
//         )
//         : ejercicios;

//     return (
//         <Container>
//             {existeEjercicios ? (
//                 <Row>
//                     <Col xs={12}>
//                         <div className="contenedorPrincipal">
//                             <div className="informacionTema">
//                                 <h1>Ejercicios</h1>
//                                 <p>Los ejercicios con fondo color rojo están desactivados</p>
//                                 <p>Es necesario seleccionar un ejercicio para editar o para activar/desactivar.</p>
//                             </div>
//                         </div>
//                     </Col>
//                     <Col xs={12}>
//                         <div className="contenedorTabla">
//                             <Form.Group controlId="formBuscar">
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Buscar ejercicio"
//                                     value={term}
//                                     onChange={(e) => setTerm(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <br />
//                             <table className="tablaTemas">
//                                 <thead>
//                                     <tr>
//                                         <th className="tituloTabla">Ejercicios existentes</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredEjercicios.length > 0 ? (
//                                         filteredEjercicios.map((ejercicio, index) => (
//                                             <tr
//                                                 key={index}
//                                                 onClick={() => actualizarEjercicioSeleccionado(ejercicio)}
//                                                 className={`
//                               ${ejercicio.estado === -1 ? "redRow" : ""}
//                               ${ejercicioSeleccionado && ejercicioSeleccionado.id === ejercicio.id
//                                                         ? "selectedRow"
//                                                         : ""}
//                             `}
//                                             >
//                                                 <td>{cleanHtmlTags(ejercicio.titulo)}</td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="1">No se encontraron ejercicios</td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </Col>
//                     <Col xs={12}>
//                         <div className="botonesDerecha">
//                             <ModalRegistrarEjercicio cargarEjercicios={cargarEjercicios} ejercicios={ejercicios} />
//                             <ModalEditarEjercicio
//                                 cargarEjercicios={cargarEjercicios}
//                                 ejercicioParaEditar={ejercicioSeleccionado}
//                             />
//                             <Button
//                                 variant="danger"
//                                 className="botonActivarDesactivarTema"
//                                 disabled={!ejercicioSeleccionado}
//                                 onClick={activarDesactivarEjercicio}
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
//                                 <Card.Title>Abre nuevos caminos: Este subtema está esperando tus ejercicios.</Card.Title>
//                                 <Card.Text style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
//                                     <ModalRegistrarEjercicio cargarEjercicios={cargarEjercicios} ejercicios={ejercicios} />
//                                 </Card.Text>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             )}
//         </Container>
//     );
// };

// export default GestionarEjercicios;
//------------------------------------------------
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col, Modal, Table, Card } from "react-bootstrap";
import "../../../assets/styles/components/main/temas/gestionarTemas.css";
import Cargando from "../../utilities/Cargando";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import ModalRegistrarEjercicio from "./ModalRegistrarEjercicio";
import ModalEditarEjercicio from "./ModalEditarEjercicio";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext"; // Importa el contexto de sesión de usuario
import Imagen from '../../../assets/images/crear.svg';

const GestionarEjercicios = () => {
    const [ejercicios, setEjercicios] = useState([]);
    const { subtemaSeleccionado } = useSubtemaSeleccionado();
    const { ejercicioSeleccionado, actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
    const [term, setTerm] = useState('');
    const [existeEjercicios, setExisteEjercicios] = useState(false);
    const [historialCambios, setHistorialCambios] = useState([]);
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const { usuarioDetalles } = useSesionUsuario(); // Usa el hook del contexto de sesión de usuario

    useEffect(() => {
        cargarEjercicios();
    }, [subtemaSeleccionado]);

    const cargarEjercicios = () => {
        axios
            .post("http://localhost:5000/ejercicios/listarEjercicios", {
                idSubtema: subtemaSeleccionado.id,
                mensaje: "ejercicios",
            })
            .then((response) => {
                if (response.data.en === 1) {
                    setEjercicios(response.data.ejercicios);
                    setExisteEjercicios(true);
                } else {
                    console.log("Hubo un problema al cargar los ejercicios");
                    setExisteEjercicios(false);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los ejercicios:", error);
            });
    };

    const activarDesactivarEjercicio = () => {
        if (ejercicioSeleccionado) {
            const nuevoEstado = ejercicioSeleccionado.estado === 1 ? -1 : 1;
            axios
                .post("http://localhost:5000/ejercicios/activarDesactivarEjercicio", {
                    id: ejercicioSeleccionado.id,
                    estado: nuevoEstado,
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        cargarEjercicios();
                        console.log("id ejercicio", ejercicioSeleccionado.id)
                        // Registro del cambio en el historial
                        const personaId = usuarioDetalles ? usuarioDetalles.detallesPersona.id : null;
                        const estadoMensaje = nuevoEstado === 1 ? "activo" : "inactivo";
                        axios
                            .post("http://localhost:5000/historial/registrarCambio", {
                                tipoEntidad: "ejercicio",
                                idEjercicio: ejercicioSeleccionado.id,
                                detalles: `${usuarioDetalles.detallesPersona.nombres} cambió el estado del ejercicio "${cleanHtmlTags(ejercicioSeleccionado.titulo)}" a ${estadoMensaje}`,
                                personaId: personaId,
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
                        console.log("No se pudo cambiar el estado del ejercicio");
                    }
                })
                .catch((error) => {
                    console.error("Error al cambiar el estado del ejercicio:", error);
                });
        }
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const getButtonText = () => {
        if (ejercicioSeleccionado === null) {
            return ejercicios[0].estado === 1 ? "Desactivar" : "Activar";
        } else if (ejercicioSeleccionado.estado === 1) {
            return "Desactivar";
        } else {
            return "Activar";
        }
    };

    const filteredEjercicios = term
        ? ejercicios.filter(ejercicio =>
            ejercicio.titulo.toLowerCase().includes(term.toLowerCase())
        )
        : ejercicios;

    const cargarHistorialCambios = () => {
        if (ejercicioSeleccionado) {
            axios
                .post("http://localhost:5000/historial/listarCambios", {
                    idEntidad: ejercicioSeleccionado.id,
                    tipoEntidad: "ejercicio",
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        setHistorialCambios(response.data.cambios);
                        setShowHistorialModal(true);
                    } else {
                        console.log("No se encontraron cambios para este ejercicio");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener el historial de cambios:", error);
                });
        }
    };


    return (
        <Container>
            {existeEjercicios ? (
                <Row>
                    <Col xs={12}>
                        <div className="contenedorPrincipal">
                            <div className="informacionTema">
                                <h1>Ejercicios</h1>
                                <p>Los ejercicios con fondo color rojo están desactivados</p>
                                <p>Es necesario seleccionar un ejercicio para editar o para activar/desactivar.</p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="contenedorTabla">
                            <Form.Group controlId="formBuscar">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar ejercicio"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <table className="tablaTemas">
                                <thead>
                                    <tr>
                                        <th className="tituloTabla">Ejercicios existentes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEjercicios.length > 0 ? (
                                        filteredEjercicios.map((ejercicio, index) => (
                                            <tr
                                                key={index}
                                                onClick={() => actualizarEjercicioSeleccionado(ejercicio)}
                                                className={`
                              ${ejercicio.estado === -1 ? "redRow" : ""}
                              ${ejercicioSeleccionado && ejercicioSeleccionado.id === ejercicio.id
                                                        ? "selectedRow"
                                                        : ""}
                            `}
                                            >
                                                <td>{cleanHtmlTags(ejercicio.titulo)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="1">No se encontraron ejercicios</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="botonesDerecha">
                            <ModalRegistrarEjercicio cargarEjercicios={cargarEjercicios} ejercicios={ejercicios} />
                            <ModalEditarEjercicio
                                cargarEjercicios={cargarEjercicios}
                                ejercicioParaEditar={ejercicioSeleccionado}
                            />
                            <Button
                                variant="danger"
                                className="botonActivarDesactivarTema"
                                disabled={!ejercicioSeleccionado}
                                onClick={activarDesactivarEjercicio}
                            >
                                {getButtonText()}
                            </Button>
                            <Button
                                variant="info"
                                onClick={cargarHistorialCambios}
                                disabled={!ejercicioSeleccionado}
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
                                <Card.Title>Abre nuevos caminos: Este subtema está esperando tus ejercicios.</Card.Title>
                                <Card.Text style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <ModalRegistrarEjercicio cargarEjercicios={cargarEjercicios} ejercicios={ejercicios} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
            {/* Historial Modal */}
            <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)}>
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
                        <p>No hay cambios registrados para este ejercicio.</p>
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

export default GestionarEjercicios;