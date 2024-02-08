import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";

export default function ModalEditarPregunta({ cargarPreguntas, preguntaParaEditar }) {
    const { usuarioDetalles } = useSesionUsuario();
    const { setPreguntaSeleccionado } = usePreguntaSeleccionado();
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
    const [estado, setEstado] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const formRef = useRef(null);

    const handleEnunciadoChange = (content) => {
        setEnunciado(content);
    };

    const handleOpcion_a_Change = (value) => setOpcion_a(value);
    const handleOpcion_b_Change = (value) => setOpcion_b(value);
    const handleOpcion_c_Change = (value) => setOpcion_c(value);
    const handleOpcion_d_Change = (value) => setOpcion_d(value);
    const handleRespuesta_correcta_Change = (value) => setRespuesta_correcta(value);
    const handleJustificacionChange = (value) => setJustificacion(value);

    useEffect(() => {
        if (preguntaParaEditar) {
            obtenerDatosPregunta();
        }
    }, [preguntaParaEditar]);

    const obtenerDatosPregunta = () => {
        setEnunciado(preguntaParaEditar.enunciado);
        setOpcion_a(preguntaParaEditar.opcion_a);
        setOpcion_b(preguntaParaEditar.opcion_b);
        setOpcion_c(preguntaParaEditar.opcion_c);
        setOpcion_d(preguntaParaEditar.opcion_d);        
        setRespuesta_correcta(preguntaParaEditar.respuesta_correcta);
        setJustificacion(preguntaParaEditar.justificacion);
        setEstado(preguntaParaEditar.estado);
    };

    const toolbarOptions = [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
    ];

    const cleanEmptyParagraphs = (content) => {
        if (content) {
            const cleanContent = content.replace(/<p><br><\/p>/g, "");
            return cleanContent;
        } else {
            return "";
        }
    };

    const isQuillContentAvailable = (content) => {
        const textOnly = content.replace(/<[^>]+>/g, '').trim();
        return textOnly.length > 0;
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
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
            setShowAlert(true);
            return;
        }

        await editarPregunta();
        setEnunciado("");
        setOpcion_a("");
        setOpcion_b("");
        setOpcion_c("");
        setOpcion_d("");
        setRespuesta_correcta("");
        setJustificacion("");
    };

    const editarPregunta = async () => {
        try {
            const datosFormulario = {
                id: preguntaParaEditar.idPregunta,
                enunciado: DOMPurify.sanitize(enunciado),
                opcion_a: DOMPurify.sanitize(opcion_a),
                opcion_b: DOMPurify.sanitize(opcion_b),
                opcion_c: DOMPurify.sanitize(opcion_c),
                opcion_d: DOMPurify.sanitize(opcion_d),
                respuesta_correcta: DOMPurify.sanitize(respuesta_correcta),
                justificacion: DOMPurify.sanitize(justificacion),
                estado: estado,
            };

            const response = await axios.post(
                "http://localhost:5000/preguntas/editarPregunta",
                datosFormulario,
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            const { preguntaEditadaBackend } = response.data;

            if (response.data.en === 1) {
                let preguntaActualizado = { ...preguntaParaEditar };
                preguntaActualizado.idPregunta = preguntaEditadaBackend.id;
                preguntaActualizado.enunciado = preguntaEditadaBackend.enunciado;
                preguntaActualizado.opcion_a = preguntaEditadaBackend.opcion_a;
                preguntaActualizado.opcion_b = preguntaEditadaBackend.opcion_b;
                preguntaActualizado.opcion_c = preguntaEditadaBackend.opcion_c;
                preguntaActualizado.opcion_d = preguntaEditadaBackend.opcion_d;
                preguntaActualizado.respuesta_correcta = preguntaEditadaBackend.respuesta_correcta;
                preguntaActualizado.justificacion = preguntaEditadaBackend.justificacion;
                preguntaActualizado.estado = preguntaEditadaBackend.estado;
                setPreguntaSeleccionado(preguntaActualizado);

                const mensaje = `Se editó la pregunta con el enunciado: "${cleanHtmlTags(
                    enunciado
                )}"`;

                // Llama al endpoint de historial para registrar el cambio
                const usuarioId = usuarioDetalles.id;
                axios
                    .post("http://localhost:5000/historial/registrarCambio", {
                        tipoEntidad: "pregunta",
                        idPregunta: preguntaParaEditar.idPregunta,
                        detalles: mensaje,
                        idUsuario: usuarioId,
                    })
                    .then((historialResponse) => {
                        if (historialResponse.data.en === 1) {
                            console.log("Cambio registrado en el historial");
                            cargarPreguntas();
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
                console.log("No se pudo editar la pregunta");
            }
        } catch (error) {
            console.error("Error al editar la pregunta:", error);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={handleShow}
                disabled={!preguntaParaEditar}
            >
                Editar
            </Button>
            <Modal show={show} onHide={handleClose} size="xl" style={{zIndex:1500}}>
                <Modal.Header closeButton>
                    <Modal.Title>Edita la pregunta de control seleccionada</Modal.Title>
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
                                                    onChange={handleOpcion_a_Change}
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
                                                    onChange={handleOpcion_b_Change}
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
                                                    onChange={handleOpcion_c_Change}
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
                                                    onChange={handleOpcion_d_Change}
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
                                                    onChange={(e) =>
                                                        setRespuesta_correcta(e.target.value)
                                                    }
                                                >
                                                    <option value="">
                                                        Selecciona la respuesta correcta
                                                    </option>
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
                            <span
                                className="closebtn"
                                onClick={() => setShowAlert(false)}
                            >
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
