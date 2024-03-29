import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";

export default function ModalEditarSubtema({ cargarSubtemas, subtemaParaEditar }) {
    const { usuarioDetalles } = useSesionUsuario();
    const { setSubtemaSeleccionado } = useSubtemaSeleccionado();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [titulo, setTitulo] = useState("");
    const [objetivos, setObjetivos] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [ejemploCodigo, setEjemploCodigo] = useState("");
    const [recursos, setRecursos] = useState("");
    const [estado, setEstado] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const formRef = useRef(null);

    const handleTituloChange = (content) => {
        setTitulo(content);
    };

    const handleObjetivosChange = (value) => setObjetivos(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleEjemploCodigoChange = (value) => setEjemploCodigo(value);
    const handleRecursosChange = (value) => setRecursos(value);

    useEffect(() => {
        if (subtemaParaEditar) {
            obtenerDatosSubtema();
        }
    }, [subtemaParaEditar]);

    const obtenerDatosSubtema = () => {
        setTitulo(subtemaParaEditar.titulo);
        setObjetivos(subtemaParaEditar.objetivos);
        setDescripcion(subtemaParaEditar.descripcion);
        setEjemploCodigo(subtemaParaEditar.ejemploCodigo);
        setRecursos(subtemaParaEditar.recursos);
        setEstado(subtemaParaEditar.estado);
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
            !isQuillContentAvailable(objetivos) ||
            !isQuillContentAvailable(descripcion) ||
            !isQuillContentAvailable(ejemploCodigo) ||
            !isQuillContentAvailable(recursos)
        ) {
            setShowAlert(true);
            return;
        }

        await editarSubtema();
        setTitulo("");
        setObjetivos("");
        setDescripcion("");
        setEjemploCodigo("");
        setRecursos("");
    };

    const editarSubtema = async () => {
        try {
            const datosFormulario = {
                id: subtemaParaEditar.idSubtema,
                titulo: DOMPurify.sanitize(titulo),
                objetivos: DOMPurify.sanitize(objetivos),
                descripcion: DOMPurify.sanitize(descripcion),
                ejemploCodigo: ejemploCodigo,
                recursos: DOMPurify.sanitize(recursos),
                estado : estado
            };

            const response = await axios.post(
                "http://localhost:5000/subtemas/editarSubtema",
                datosFormulario,
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );
            const { subtemaEditadoBackend } = response.data;

            if (response.data.en === 1) {
                let subtemaActualizado = { ...subtemaParaEditar };
                subtemaActualizado.idSubtema = subtemaEditadoBackend.id;
                subtemaActualizado.titulo = subtemaEditadoBackend.titulo;
                subtemaActualizado.objetivos = subtemaEditadoBackend.objetivos;
                subtemaActualizado.descripcion = subtemaEditadoBackend.descripcion;
                subtemaActualizado.ejemploCodigo = subtemaEditadoBackend.ejemploCodigo;
                subtemaActualizado.recursos = subtemaEditadoBackend.recursos;
                subtemaActualizado.estado = subtemaEditadoBackend.estado;
                setSubtemaSeleccionado(subtemaActualizado);

                const mensaje = `Se editó el subtema con el título: "${cleanHtmlTags(
                    titulo
                )}"`;

                // Llama al endpoint de historial para registrar el cambio
                const usuarioId = usuarioDetalles.id;
                axios
                    .post("http://localhost:5000/historial/registrarCambio", {
                        tipoEntidad: "subtema",
                        idSubtema: subtemaParaEditar.idSubtema,
                        detalles: mensaje,
                        idUsuario: usuarioId,
                    })
                    .then((historialResponse) => {
                        if (historialResponse.data.en === 1) {
                            console.log("Cambio registrado en el historial");
                            cargarSubtemas();
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
                console.log("No se pudo editar el subtema");
            }
        } catch (error) {
            console.error("Error al editar el subtema:", error);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={handleShow}
                disabled={!subtemaParaEditar}
            >
                Editar
            </Button>
            <Modal show={show} onHide={handleClose} size="xl" style={{zIndex:1500}}>
                <Modal.Header closeButton>
                    <Modal.Title>Edita el subtema seleccionado</Modal.Title>
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
                                                Objetivos de aprendizaje:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={objetivos}
                                                    onChange={handleObjetivosChange}
                                                    modules={{ toolbar: toolbarOptions }}
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Descripción:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={descripcion}
                                                    onChange={handleDescripcionChange}
                                                    modules={{ toolbar: toolbarOptions }}
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Ejemplo de código:
                                                <br />
                                                <br />
                                                <Editor
                                                    height="200px"
                                                    defaultLanguage="c"
                                                    value={ejemploCodigo}
                                                    onChange={(newValue) =>
                                                        handleEjemploCodigoChange(newValue)
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <div className="grupoFormulario">
                                            <label className="etiqueta">
                                                Recursos adicionales:
                                                <br />
                                                <br />
                                                <ReactQuill
                                                    value={recursos}
                                                    onChange={handleRecursosChange}
                                                    modules={{ toolbar: toolbarOptions }}
                                                />
                                            </label>
                                            <br />
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
                                            __html: cleanEmptyParagraphs(objetivos),
                                        }}
                                    />
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(descripcion),
                                        }}
                                    />
                                    <div style={{ textAlign: "justify" }}>
                                        <pre>{ejemploCodigo}</pre>
                                    </div>
                                    <div
                                        style={{ textAlign: "justify" }}
                                        dangerouslySetInnerHTML={{
                                            __html: cleanEmptyParagraphs(recursos),
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
