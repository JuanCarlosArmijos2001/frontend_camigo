// import React, { useState, useRef, useEffect } from "react";
// import { Container, Row, Col, Button, Toast } from "react-bootstrap";
// import Modal from "react-bootstrap/Modal";
// import ReactQuill from "react-quill";
// import axios from "axios";
// import Editor from "@monaco-editor/react";
// import DOMPurify from "dompurify";
// import "react-quill/dist/quill.snow.css";
// import "../../../assets/styles/components/main/temas/modalRegistrarTema.css";
// import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";

// export default function ModalRegistrarEjercicio({ cargarEjercicios, ejercicios }) {
//     const formRef = useRef(null);
//     const [show, setShow] = useState(false);
//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//     const [titulo, setTitulo] = useState("");
//     const [instrucciones, setInstrucciones] = useState("");
//     const [restricciones, setRestricciones] = useState("");
//     const [solucion, setSolucion] = useState("");
//     const [showAlert, setShowAlert] = useState(false);
//     const { subtemaSeleccionado } = useSubtemaSeleccionado();

//     const handleTituloChange = (content) => {
//         setTitulo(content);
//     };

//     const handleInstruccionesChange = (value) => setInstrucciones(value);
//     const handleRestriccionesChange = (value) => setRestricciones(value);
//     const handleSolucionChange = (value) => setSolucion(value);

//     const toolbarOptions = [
//         [{ header: "1" }, { header: "2" }],
//         ["bold", "italic", "underline", "strike", "blockquote"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link"],
//     ];

//     const cleanEmptyParagraphs = (content) => {
//         const cleanContent = content.replace(/<p><br><\/p>/g, "");
//         return cleanContent;
//     };

//     const isQuillContentAvailable = (content) => {
//         const textOnly = content.replace(/<[^>]+>/g, "").trim();
//         return textOnly.length > 0;
//     };

//     //Controles para evitar que se envíe el formulario vacío
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (
//             !isQuillContentAvailable(titulo) ||
//             !isQuillContentAvailable(instrucciones) ||
//             !isQuillContentAvailable(restricciones) ||
//             !isQuillContentAvailable(solucion)
//         ) {
//             setShowAlert("Por favor completa todos los campos.");
//             return;
//         }

//         if (tituloExistente(titulo)) {
//             setShowAlert("El ejercicio ya existe.");
//             return;
//         }

//         await crearEjercicio();
//         setTitulo("");
//         setInstrucciones("");
//         setRestricciones("");
//         setSolucion("");
//     };

//     const tituloExistente = (titulo) => {
//         if (ejercicios) {
//             return ejercicios.some((ejercicio) => {
//                 if (ejercicio.titulo === titulo) {
//                     return true;
//                 }
//                 return false;
//             });
//         }
//         return false;
//     };

//     const crearEjercicio = async () => {
//         try {
//             const datosFormulario = {
//                 titulo: DOMPurify.sanitize(titulo),
//                 instrucciones: DOMPurify.sanitize(instrucciones),
//                 restricciones: DOMPurify.sanitize(restricciones),
//                 solucion: DOMPurify.sanitize(solucion),
//                 idSubtema: subtemaSeleccionado.id,
//             };

//             const response = await axios.post(
//                 "http://localhost:5000/ejercicios/registrarEjercicio",
//                 datosFormulario,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         version: "1.0.0",
//                     },
//                 }
//             );

//             if (response.data.en === 1) {
//                 console.log("Se creó el ejercicio correctamente");
//                 cargarEjercicios();
//                 handleClose();
//             } else {
//                 console.log("No se pudo crear el ejercicio");
//             }
//         } catch (error) {
//             console.error("Error al crear el ejercicio:", error);
//         }
//     };

//     return (
//         <>
//             <Button variant="success" onClick={handleShow}>
//                 Crear
//             </Button>
//             <Modal show={show} onHide={handleClose} size="xl">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Crea un nuevo ejercicio</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Container id="contenedor">
//                         <Row id="fila1">
//                             <Col id="columna1">
//                                 <div className="contenedorFormulario">
//                                     <form ref={formRef} onSubmit={handleSubmit}>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Título:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={titulo}
//                                                     onChange={handleTituloChange}
//                                                     modules={{ toolbar: toolbarOptions }}
//                                                     className="small-textarea"
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Instrucciones:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={instrucciones}
//                                                     onChange={handleInstruccionesChange}
//                                                     modules={{ toolbar: toolbarOptions }}
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Restricciones:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={restricciones}
//                                                     onChange={handleRestriccionesChange}
//                                                     modules={{ toolbar: toolbarOptions }}
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div
//                                             className="grupoFormulario"
//                                             style={{
//                                                 border: "1px solid #ccc",
//                                                 padding: "10px",
//                                                 borderRadius: "5px",
//                                             }}
//                                         >
//                                             <label className="etiqueta">
//                                                 Solución en código:
//                                                 <br />
//                                                 <br />
//                                                 <Editor
//                                                     height="200px"
//                                                     defaultLanguage="c"
//                                                     value={solucion}
//                                                     onChange={(newValue) =>
//                                                         handleSolucionChange(newValue)
//                                                     }
//                                                 />
//                                             </label>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </Col>
//                             <Col id="columna2">
//                                 <div style={{ textAlign: "justify" }}>
//                                     <h2>Previsualizar</h2>
//                                     <div
//                                         style={{ textAlign: "justify" }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: cleanEmptyParagraphs(titulo),
//                                         }}
//                                     />
//                                     <div
//                                         style={{ textAlign: "justify" }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: cleanEmptyParagraphs(instrucciones),
//                                         }}
//                                     />
//                                     <div
//                                         style={{ textAlign: "justify" }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: cleanEmptyParagraphs(restricciones),
//                                         }}
//                                     />
//                                     <div style={{ textAlign: "justify" }}>
//                                         <pre>{solucion}</pre>
//                                     </div>
//                                 </div>
//                             </Col>
//                         </Row>
//                     </Container>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>
//                         Cancelar
//                     </Button>
//                     <Button variant="success" onClick={handleSubmit}>
//                         Guardar
//                     </Button>
//                 </Modal.Footer>
//                 <div>
//                     {showAlert && (
//                         <div className="custom-alert">
//                             <span className="closebtn" onClick={() => setShowAlert(false)}>
//                                 &times;
//                             </span>
//                             {showAlert}
//                         </div>
//                     )}
//                 </div>
//             </Modal>
//         </>
//     );
// }
//-----------------------------------------------------------------
import React, { useState, useRef } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import ReactQuill from "react-quill";
import Editor from "@monaco-editor/react";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import "../../../assets/styles/components/main/temas/modalRegistrarTema.css";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";

export default function ModalRegistrarEjercicio({ cargarEjercicios, ejercicios }) {
    const formRef = useRef(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [titulo, setTitulo] = useState("");
    const [instrucciones, setInstrucciones] = useState("");
    const [restricciones, setRestricciones] = useState("");
    const [solucion, setSolucion] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const { subtemaSeleccionado } = useSubtemaSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();

    const handleTituloChange = (content) => {
        setTitulo(content);
    };

    const handleInstruccionesChange = (value) => setInstrucciones(value);
    const handleRestriccionesChange = (value) => setRestricciones(value);
    const handleSolucionChange = (value) => setSolucion(value);

    const toolbarOptions = [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
    ];

    const cleanEmptyParagraphs = (content) => {
        const cleanContent = content.replace(/<p><br><\/p>/g, "");
        return cleanContent;
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const isQuillContentAvailable = (content) => {
        const textOnly = content.replace(/<[^>]+>/g, "").trim();
        return textOnly.length > 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !isQuillContentAvailable(titulo) ||
            !isQuillContentAvailable(instrucciones) ||
            !isQuillContentAvailable(restricciones) ||
            !isQuillContentAvailable(solucion)
        ) {
            setShowAlert("Por favor completa todos los campos.");
            return;
        }

        if (tituloExistente(titulo)) {
            setShowAlert("El ejercicio ya existe.");
            return;
        }

        await crearEjercicio();
        setTitulo("");
        setInstrucciones("");
        setRestricciones("");
        setSolucion("");
    };

    const tituloExistente = (titulo) => {
        if (ejercicios) {
            return ejercicios.some((ejercicio) => {
                if (ejercicio.titulo === titulo) {
                    return true;
                }
                return false;
            });
        }
        return false;
    };

    const crearEjercicio = async () => {
        try {
            const datosFormulario = {
                titulo: titulo, 
                instrucciones: DOMPurify.sanitize(instrucciones),
                restricciones: DOMPurify.sanitize(restricciones),
                // solucion: DOMPurify.sanitize(solucion),
                solucion: solucion,
                idSubtema: subtemaSeleccionado.id,
            };

            const response = await axios.post(
                "http://localhost:5000/ejercicios/registrarEjercicio",
                datosFormulario,
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            if (response.data.en === 1) {
                // Registro en el historial
                const nuevoEjercicioId = response.data.idEjercicio;
                const mensaje = `${usuarioDetalles.detallesPersona.nombres} creó el ejercicio con el título: "${cleanHtmlTags(
                    titulo
                )}"`;

                const usuarioId = usuarioDetalles.id;
                axios
                    .post("http://localhost:5000/historial/registrarCambio", {
                        tipoEntidad: "ejercicio",
                        idEjercicio: nuevoEjercicioId,
                        detalles: mensaje,
                        idUsuario: usuarioId,
                    })
                    .then((historialResponse) => {
                        if (historialResponse.data.en === 1) {
                            console.log("Cambio registrado en el historial");
                            cargarEjercicios();
                            handleClose();
                        } else {
                            console.log("No se pudo registrar el cambio en el historial");
                        }
                    })
                    .catch((error) => {
                        console.error("Error al registrar el cambio en el historial:", error);
                    });
            } else {
                console.log("No se pudo crear el ejercicio");
            }
        } catch (error) {
            console.error("Error al crear el ejercicio:", error);
        }
    };

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Crear
            </Button>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Crea un nuevo ejercicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container id="contenedor">
                        <Row id="fila1">
                            <Col id="columna1">
                                <div className="contenedorFormulario">
                                    <form ref={formRef} onSubmit={handleSubmit}>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Título:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={titulo}
                                                    onChange={handleTituloChange}
                                                    modules={{ toolbar: toolbarOptions }}
                                                    className="small-textarea"
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Instrucciones:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={instrucciones}
                                                    onChange={handleInstruccionesChange}
                                                    modules={{ toolbar: toolbarOptions }}
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Restricciones:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={restricciones}
                                                    onChange={handleRestriccionesChange}
                                                    modules={{ toolbar: toolbarOptions }}
                                                />
                                            </label>
                                        </div>
                                        <div
                                            className="grupoFormulario"
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "10px",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            <label className="etiqueta">
                                                Solución en código:
                                                <br />
                                                <br />
                                                <Editor
                                                    height="200px"
                                                    defaultLanguage="c"
                                                    value={solucion}
                                                    onChange={(newValue) => handleSolucionChange(newValue)}
                                                />
                                            </label>
                                        </div>
                                    </form>
                                </div>
                            </Col>
                            <Col id="columna2">
                                <div style={{ textAlign: "justify" }}>
                                    <h2>Previsualizar</h2>
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(titulo),
                                        }}
                                    />
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(instrucciones),
                                        }}
                                    />
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(restricciones),
                                        }}
                                    />
                                    <div style={{ textAlign: "justify" }}>
                                        <pre>{solucion}</pre>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        Guardar
                    </Button>
                </Modal.Footer>
                <div>
                    {showAlert && (
                        <div className="custom-alert">
                            <span className="closebtn" onClick={() => setShowAlert(false)}>
                                &times;
                            </span>
                            {showAlert}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
