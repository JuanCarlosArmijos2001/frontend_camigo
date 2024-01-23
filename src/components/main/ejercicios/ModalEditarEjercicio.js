// import React, { useState, useRef, useEffect } from "react";
// import { Container, Row, Col, Button, Alert } from "react-bootstrap";
// import Modal from "react-bootstrap/Modal";
// import ReactQuill from "react-quill";
// import axios from "axios";
// import Editor from "@monaco-editor/react";
// import DOMPurify from "dompurify";
// import "react-quill/dist/quill.snow.css";

// export default function ModalEditarEjercicio({ cargarEjercicios, ejercicioParaEditar }) {
//     const [show, setShow] = useState(false);
//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//     const [titulo, setTitulo] = useState("");
//     const [instrucciones, setInstrucciones] = useState("");
//     const [restricciones, setRestricciones] = useState("");
//     const [solucion, setSolucion] = useState("");
//     const [showAlert, setShowAlert] = useState(false);
//     const formRef = useRef(null);


//     const handleTituloChange = (content) => {
//         setTitulo(content);
//     };

//     const handleInstruccionesChange = (value) => setInstrucciones(value);
//     const handleRestriccionesChange = (value) => setRestricciones(value);
//     const handleSolucionChange = (value) => setSolucion(value);

//     useEffect(() => {
//         if (ejercicioParaEditar) {
//             obtenerDatosEjercicio();
//         }
//     }, [ejercicioParaEditar]);

//     const obtenerDatosEjercicio = () => {
//         setTitulo(ejercicioParaEditar.titulo);
//         setInstrucciones(ejercicioParaEditar.instrucciones);
//         setRestricciones(ejercicioParaEditar.restricciones);
//         setSolucion(ejercicioParaEditar.solucion);
//     };

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
//         const textOnly = content.replace(/<[^>]+>/g, '').trim();
//         return textOnly.length > 0;
//     };



//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!isQuillContentAvailable(titulo) || !isQuillContentAvailable(instrucciones) || !isQuillContentAvailable(restricciones) || !isQuillContentAvailable(solucion)) {
//             setShowAlert(true);
//             return;
//         }

//         await editarTema();
//         setTitulo("");
//         setInstrucciones("");
//         setRestricciones("");
//         setSolucion("");
//     };

//     const editarTema = async () => {
//         try {
//             const datosFormulario = {
//                 id: ejercicioParaEditar.id,
//                 titulo: DOMPurify.sanitize(titulo),
//                 instrucciones: DOMPurify.sanitize(instrucciones),
//                 restricciones: DOMPurify.sanitize(restricciones),
//                 solucion: DOMPurify.sanitize(solucion),
//             };

//             const response = await axios.post(
//                 "http://localhost:5000/ejercicios/editarEjercicio",
//                 datosFormulario,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         version: "1.0.0",
//                     },
//                 }
//             );

//             if (response.data.en === 1) {
//                 console.log("Se editó el ejercicio correctamente");
//                 cargarEjercicios();
//                 handleClose();
//             } else {
//                 console.log("No se pudo editar el ejercicio");
//             }
//         } catch (error) {
//             console.error("Error al editar el ejercicio:", error);
//         }
//     };

//     return (
//         <>
//             <Button
//                 variant="primary"
//                 onClick={handleShow}
//                 disabled={!ejercicioParaEditar}
//             >
//                 Editar
//             </Button>
//             <Modal show={show} onHide={handleClose} size="xl">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edita el ejercicio seleccionado</Modal.Title>
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
//                     <Button variant="success" onClick={handleSubmit}>Guardar</Button>
//                 </Modal.Footer>
//                 <div>
//                     {showAlert && (
//                         <div className="custom-alert">
//                             <span className="closebtn" onClick={() => setShowAlert(false)}>&times;</span>
//                             Por favor completa todos los campos.
//                         </div>
//                     )}
//                 </div>
//             </Modal>
//         </>
//     );
// }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import Editor from "@monaco-editor/react";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";

export default function ModalEditarEjercicio({ cargarEjercicios, ejercicioParaEditar }) {
    const { usuarioDetalles } = useSesionUsuario();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [titulo, setTitulo] = useState("");
    const [instrucciones, setInstrucciones] = useState("");
    const [restricciones, setRestricciones] = useState("");
    const [solucion, setSolucion] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const formRef = useRef(null);

    const handleTituloChange = (content) => {
        setTitulo(content);
    };

    const handleInstruccionesChange = (value) => setInstrucciones(value);
    const handleRestriccionesChange = (value) => setRestricciones(value);
    const handleSolucionChange = (value) => setSolucion(value);

    useEffect(() => {
        if (ejercicioParaEditar) {
            obtenerDatosEjercicio();
        }
    }, [ejercicioParaEditar]);

    const obtenerDatosEjercicio = () => {
        setTitulo(ejercicioParaEditar.titulo);
        setInstrucciones(ejercicioParaEditar.instrucciones);
        setRestricciones(ejercicioParaEditar.restricciones);
        setSolucion(ejercicioParaEditar.solucion);
    };

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

    const isQuillContentAvailable = (content) => {
        const textOnly = content.replace(/<[^>]+>/g, "").trim();
        return textOnly.length > 0;
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !isQuillContentAvailable(titulo) ||
            !isQuillContentAvailable(instrucciones) ||
            !isQuillContentAvailable(restricciones) ||
            !isQuillContentAvailable(solucion)
        ) {
            setShowAlert(true);
            return;
        }

        await editarEjercicio();
        setTitulo("");
        setInstrucciones("");
        setRestricciones("");
        setSolucion("");
    };

    const editarEjercicio = async () => {
        try {
            const datosFormulario = {
                id: ejercicioParaEditar.id,
                titulo: DOMPurify.sanitize(titulo),
                instrucciones: DOMPurify.sanitize(instrucciones),
                restricciones: DOMPurify.sanitize(restricciones),
                solucion: DOMPurify.sanitize(solucion),
            };

            const response = await axios.post(
                "http://localhost:5000/ejercicios/editarEjercicio",
                datosFormulario,
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            if (response.data.en === 1) {
                const mensaje = `Se editó el ejercicio con el título: "${cleanHtmlTags(
                    titulo
                )}"`;

                // Llama al endpoint de historial para registrar el cambio
                const personaId = usuarioDetalles
                    ? usuarioDetalles.detallesPersona.id
                    : null;
                axios
                    .post("http://localhost:5000/historial/registrarCambio", {
                        tipoEntidad: "ejercicio",
                        idEjercicio: ejercicioParaEditar.id,
                        detalles: mensaje,
                        personaId: personaId,
                    })
                    .then((historialResponse) => {
                        if (historialResponse.data.en === 1) {
                            console.log("Cambio registrado en el historial");
                            cargarEjercicios();
                            handleClose();
                        } else {
                            console.log(
                                "No se pudo registrar el cambio en el historial"
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(
                            "Error al registrar el cambio en el historial:",
                            error
                        );
                    });
            } else {
                console.log("No se pudo editar el ejercicio");
            }
        } catch (error) {
            console.error("Error al editar el ejercicio:", error);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={handleShow}
                disabled={!ejercicioParaEditar}
            >
                Editar
            </Button>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Edita el ejercicio seleccionado</Modal.Title>
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
                                                    onChange={(newValue) =>
                                                        handleSolucionChange(newValue)
                                                    }
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
                            Por favor completa todos los campos.
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
