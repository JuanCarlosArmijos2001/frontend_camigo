// import React, { useState, useRef, useEffect } from "react";
// import { Container, Row, Col, Button, Toast } from "react-bootstrap";
// import Modal from "react-bootstrap/Modal";
// import ReactQuill from "react-quill";
// import axios from "axios";
// import DOMPurify from "dompurify";
// import "react-quill/dist/quill.snow.css";
// import "../../../assets/styles/components/main/temas/modalRegistrarTema.css";
// import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";

// export default function ModalRegistrarPreguntas({ cargarPreguntas, preguntas }) {
//     const formRef = useRef(null);
//     const [show, setShow] = useState(false);
//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//     const [enunciado, setEnunciado] = useState("");
//     const [opcion_a, setOpcion_a] = useState("");
//     const [opcion_b, setOpcion_b] = useState("");
//     const [opcion_c, setOpcion_c] = useState("");
//     const [opcion_d, setOpcion_d] = useState("");
//     const [respuesta_correcta, setRespuesta_correcta] = useState("");
//     const [justificacion, setJustificacion] = useState("");
//     const [showAlert, setShowAlert] = useState(false);
//     const { ejercicioSeleccionado } = useEjercicioSeleccionado();

//     const handleEnunciadoChange = (content) => {
//         setEnunciado(content);
//     };
//     // const handleEnunciadoChange = (value) => setEnunciado(value);
//     const handleOpcion_a_Change = (value) => setOpcion_a(value);
//     const handleOpcion_b_Change = (value) => setOpcion_b(value);
//     const handleOpcion_c_Change = (value) => setOpcion_c(value);
//     const handleOpcion_d_Change = (value) => setOpcion_d(value);
//     const handleRespuesta_correcta_Change = (value) => setRespuesta_correcta(value);
//     const handleJustificacionChange = (value) => setJustificacion(value);

//     const toolbarOptions = [
//         [{ header: "1" }, { header: "2" }],
//         ["bold", "italic", "underline", "strike", "blockquote"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link"],
//     ];


//     const cleanEmptyParagraphs = (content) => {
//         if (typeof content === 'string' || content instanceof String) {
//             return content.replace(/<p><br><\/p>/g, ''); // Modifica la expresión regular según tus necesidades
//         }
//         return content;
//     };

//     const isQuillContentAvailable = (content) => {
//         if (typeof content === 'string' || content instanceof String) {
//             const textOnly = content.replace(/<[^>]+>/g, "").trim();
//             return textOnly.length > 0;
//         }
//         return false;
//     };

//     //Controles para evitar que se envíe el formulario vacío
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (
//             !isQuillContentAvailable(enunciado) ||
//             !isQuillContentAvailable(opcion_a) ||
//             !isQuillContentAvailable(opcion_b) ||
//             !isQuillContentAvailable(opcion_c) ||
//             !isQuillContentAvailable(opcion_d) ||
//             !isQuillContentAvailable(justificacion)
//         ) {
//             setShowAlert("Por favor completa todos los campos.");
//             return;
//         }

//         if (preguntaExistente(enunciado)) {
//             setShowAlert("La pregunta ya existe.");
//             return;
//         }

//         await crearPregunta();
//         setEnunciado("");
//         setOpcion_a("");
//         setOpcion_b("");
//         setOpcion_c("");
//         setOpcion_d("");
//         setRespuesta_correcta("");
//         setJustificacion("");
//     };

//     const preguntaExistente = (pregunta) => {
//         if (preguntas) {
//             return preguntas.some((enunciado) => {
//                 if (enunciado.pregunta === pregunta) {
//                     return true;
//                 }
//                 return false;
//             });
//         }
//         return false;
//     };

//     const crearPregunta = async () => {
//         try {
//             const datosFormulario = {
//                 enunciado: DOMPurify.sanitize(enunciado),
//                 opcion_a: DOMPurify.sanitize(opcion_a),
//                 opcion_b: DOMPurify.sanitize(opcion_b),
//                 opcion_c: DOMPurify.sanitize(opcion_c),
//                 opcion_d: DOMPurify.sanitize(opcion_d),
//                 respuesta_correcta: DOMPurify.sanitize(respuesta_correcta),
//                 justificacion: DOMPurify.sanitize(justificacion),
//                 idEjercicio: ejercicioSeleccionado.id,
//             };
//             console.log("Enunciado", enunciado)
//             const response = await axios.post(
//                 "http://localhost:5000/preguntas/registrarPregunta",
//                 datosFormulario,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         version: "1.0.0",
//                     },
//                 }
//             );

//             if (response.data.en === 1) {
//                 console.log("Se creó la pregunta correctamente");
//                 cargarPreguntas();
//                 handleClose();
//             } else {
//                 console.log("No se pudo crear la pregunta");
//             }
//         } catch (error) {
//             console.error("Error al crear la pregunta:", error);
//         }
//     };

//     return (
//         <>
//             <Button variant="success" onClick={handleShow}>
//                 Crear
//             </Button>
//             <Modal show={show} onHide={handleClose} size="xl">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Crea una nueva pregunta de control</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Container  id="contenedor">
//                         <Row id="fila1">
//                             <Col id="columna1">
//                                 <div className="contenedorFormulario">
//                                     <form ref={formRef} onSubmit={handleSubmit}>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Enunciado:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={enunciado}
//                                                     onChange={handleEnunciadoChange}
//                                                     modules={{ toolbar: toolbarOptions }}
//                                                     className="small-textarea"
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Primera opción:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={opcion_a}
//                                                     onChange={handleOpcion_a_Change}
//                                                     modules={{ toolbar: toolbarOptions }}
//                                                     className="small-textarea"
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Segunda opción:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={opcion_b}
//                                                     onChange={handleOpcion_b_Change}
//                                                     modules={{ toolbar: toolbarOptions }}
//                                                     className="small-textarea"
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Tercera opción:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={opcion_c}
//                                                     onChange={handleOpcion_c_Change}
//                                                     modules={{ toolbar: toolbarOptions }}
//                                                     className="small-textarea"
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Cuarta opción:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={opcion_d}
//                                                     onChange={handleOpcion_d_Change}
//                                                     modules={{ toolbar: toolbarOptions }}
//                                                     className="small-textarea"
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Respuesta correcta:
//                                                 <br />
//                                                 <br />
//                                                 <select
//                                                     value={respuesta_correcta}
//                                                     onChange={(e) => setRespuesta_correcta(e.target.value)}
//                                                 >
//                                                     <option value="">Selecciona la respuesta correcta</option>
//                                                     <option value="a">Opción A</option>
//                                                     <option value="b">Opción B</option>
//                                                     <option value="c">Opción C</option>
//                                                     <option value="d">Opción D</option>
//                                                 </select>
//                                             </label>
//                                         </div>
//                                         <div className="grupoFormulario">
//                                             <label className="etiqueta">
//                                                 Justificación:
//                                                 <br />
//                                                 <br />
//                                                 <ReactQuill
//                                                     value={justificacion}
//                                                     onChange={handleJustificacionChange}
//                                                     modules={{ toolbar: toolbarOptions }}
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
//                                             __html: cleanEmptyParagraphs(enunciado),
//                                         }}
//                                     />
//                                     <div
//                                         style={{ textAlign: "justify" }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: cleanEmptyParagraphs(opcion_a),
//                                         }}
//                                     />
//                                     <div
//                                         style={{ textAlign: "justify" }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: cleanEmptyParagraphs(opcion_b),
//                                         }}
//                                     />
//                                     <div
//                                         style={{ textAlign: "justify" }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: cleanEmptyParagraphs(opcion_c),
//                                         }}
//                                     />
//                                     <div
//                                         style={{ textAlign: "justify" }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: cleanEmptyParagraphs(opcion_d),
//                                         }}
//                                     />
//                                     <div
//                                         style={{ textAlign: "justify" }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: cleanEmptyParagraphs(justificacion),
//                                         }}
//                                     />
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
//---------------------------------
import React, { useState, useRef } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import "../../../assets/styles/components/main/temas/modalRegistrarTema.css";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";

export default function ModalRegistrarPreguntas({ cargarPreguntas, preguntas }) {
    const formRef = useRef(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [enunciado, setEnunciado] = useState("");
    const [opcion_a, setOpcion_a] = useState("");
    const [opcion_b, setOpcion_b] = useState("");
    const [opcion_c, setOpcion_c] = useState("");
    const [opcion_d, setOpcion_d] = useState("");
    const [respuesta_correcta, setRespuesta_correcta] = useState("");
    const [justificacion, setJustificacion] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();

    const handleEnunciadoChange = (content) => {
        setEnunciado(content);
    };

    const handleOpcion_a_Change = (value) => setOpcion_a(value);
    const handleOpcion_b_Change = (value) => setOpcion_b(value);
    const handleOpcion_c_Change = (value) => setOpcion_c(value);
    const handleOpcion_d_Change = (value) => setOpcion_d(value);
    const handleRespuesta_correcta_Change = (value) => setRespuesta_correcta(value);
    const handleJustificacionChange = (value) => setJustificacion(value);

    const toolbarOptions = [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
    ];

    const cleanEmptyParagraphs = (content) => {
        if (typeof content === "string" || content instanceof String) {
            return content.replace(/<p><br><\/p>/g, ""); // Modifica la expresión regular según tus necesidades
        }
        return content;
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const isQuillContentAvailable = (content) => {
        if (typeof content === "string" || content instanceof String) {
            const textOnly = content.replace(/<[^>]+>/g, "").trim();
            return textOnly.length > 0;
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !isQuillContentAvailable(enunciado) ||
            !isQuillContentAvailable(opcion_a) ||
            !isQuillContentAvailable(opcion_b) ||
            !isQuillContentAvailable(opcion_c) ||
            !isQuillContentAvailable(opcion_d) ||
            !isQuillContentAvailable(justificacion)
        ) {
            setShowAlert("Por favor completa todos los campos.");
            return;
        }

        if (preguntaExistente(enunciado)) {
            setShowAlert("La pregunta ya existe.");
            return;
        }

        await crearPregunta();
        setEnunciado("");
        setOpcion_a("");
        setOpcion_b("");
        setOpcion_c("");
        setOpcion_d("");
        setRespuesta_correcta("");
        setJustificacion("");
    };

    const preguntaExistente = (pregunta) => {
        if (preguntas) {
            return preguntas.some((pregunta) => {
                if (pregunta.enunciado === pregunta) {
                    return true;
                }
                return false;
            });
        }
        return false;
    };

    const crearPregunta = async () => {
        try {
            const datosFormulario = {
                enunciado: enunciado, // Limpia las etiquetas HTML del enunciado
                opcion_a: DOMPurify.sanitize(opcion_a),
                opcion_b: DOMPurify.sanitize(opcion_b),
                opcion_c: DOMPurify.sanitize(opcion_c),
                opcion_d: DOMPurify.sanitize(opcion_d),
                respuesta_correcta: DOMPurify.sanitize(respuesta_correcta),
                justificacion: DOMPurify.sanitize(justificacion),
                idEjercicio: ejercicioSeleccionado.id,
            };

            const response = await axios.post(
                "http://localhost:5000/preguntas/registrarPregunta",
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
                const nuevaPreguntaId = response.data.idPregunta;
                const mensaje = `${usuarioDetalles.detallesPersona.nombres} creó la pregunta con el enunciado: "${cleanHtmlTags(
                    enunciado
                )}"`;

                const personaId = usuarioDetalles ? usuarioDetalles.detallesPersona.id : null;
                axios
                    .post("http://localhost:5000/historial/registrarCambio", {
                        tipoEntidad: "pregunta",
                        idPregunta: nuevaPreguntaId,
                        detalles: mensaje,
                        personaId: personaId,
                    })
                    .then((historialResponse) => {
                        if (historialResponse.data.en === 1) {
                            console.log("Cambio registrado en el historial");
                            cargarPreguntas();
                            handleClose();
                        } else {
                            console.log("No se pudo registrar el cambio en el historial");
                        }
                    })
                    .catch((error) => {
                        console.error("Error al registrar el cambio en el historial:", error);
                    });
            } else {
                console.log("No se pudo crear la pregunta");
            }
        } catch (error) {
            console.error("Error al crear la pregunta:", error);
        }
    };

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Crear
            </Button>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Crea una nueva pregunta de control</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container id="contenedor">
                        <Row id="fila1">
                            <Col id="columna1">
                                <div className="contenedorFormulario">
                                    <form ref={formRef} onSubmit={handleSubmit}>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Enunciado:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={enunciado}
                                                    onChange={handleEnunciadoChange}
                                                    modules={{ toolbar: toolbarOptions }}
                                                    className="small-textarea"
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Primera opción:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={opcion_a}
                                                    onChange={(value) => handleOpcion_a_Change(value)}
                                                    modules={{ toolbar: toolbarOptions }}
                                                    className="small-textarea"
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Segunda opción:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={opcion_b}
                                                    onChange={(value) => handleOpcion_b_Change(value)}
                                                    modules={{ toolbar: toolbarOptions }}
                                                    className="small-textarea"
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Tercera opción:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={opcion_c}
                                                    onChange={(value) => handleOpcion_c_Change(value)}
                                                    modules={{ toolbar: toolbarOptions }}
                                                    className="small-textarea"
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Cuarta opción:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={opcion_d}
                                                    onChange={(value) => handleOpcion_d_Change(value)}
                                                    modules={{ toolbar: toolbarOptions }}
                                                    className="small-textarea"
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Respuesta correcta:
                                                <br />
                                                <br />
                                                <select
                                                    value={respuesta_correcta}
                                                    onChange={(e) => setRespuesta_correcta(e.target.value)}
                                                >
                                                    <option value="">Selecciona la respuesta correcta</option>
                                                    <option value="a">Opción A</option>
                                                    <option value="b">Opción B</option>
                                                    <option value="c">Opción C</option>
                                                    <option value="d">Opción D</option>
                                                </select>
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Justificación:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={justificacion}
                                                    onChange={handleJustificacionChange}
                                                    modules={{ toolbar: toolbarOptions }}
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
                                            __html: cleanEmptyParagraphs(enunciado),
                                        }}
                                    />
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(opcion_a),
                                        }}
                                    />
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(opcion_b),
                                        }}
                                    />
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(opcion_c),
                                        }}
                                    />
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(opcion_d),
                                        }}
                                    />
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(justificacion),
                                        }}
                                    />
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
