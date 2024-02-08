import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";

export default function ModalEditarTema({ cargarTemas, temaParaEditar }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [titulo, setTitulo] = useState("");
    const [objetivos, setObjetivos] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [recursos, setRecursos] = useState("");
    const [estado, setEstado] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const formRef = useRef(null);
    const { usuarioDetalles } = useSesionUsuario();
    const { setTemaSeleccionado } = useTemaSeleccionado();


    const handleTituloChange = (content) => {
        setTitulo(content);
    };

    const handleObjetivosChange = (value) => setObjetivos(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleRecursosChange = (value) => setRecursos(value);

    useEffect(() => {
        if (temaParaEditar) {
            obtenerDatosTema();
        }
    }, [temaParaEditar]);

    const obtenerDatosTema = () => {
        setTitulo(temaParaEditar.titulo);
        setObjetivos(temaParaEditar.objetivos);
        setDescripcion(temaParaEditar.descripcion);
        setRecursos(temaParaEditar.recursos);
        setEstado(temaParaEditar.estado);
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
        const textOnly = content.replace(/<[^>]+>/g, '').trim();
        return textOnly.length > 0;
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isQuillContentAvailable(titulo) || !isQuillContentAvailable(objetivos) || !isQuillContentAvailable(descripcion) || !isQuillContentAvailable(recursos)) {
            setShowAlert(true);
            return;
        }

        await editarTema();
        setTitulo("");
        setObjetivos("");
        setDescripcion("");
        setRecursos("");
    };

    const editarTema = async () => {
        try {
            const datosFormulario = {
                id: temaParaEditar.idTema,
                titulo: DOMPurify.sanitize(titulo),
                objetivos: DOMPurify.sanitize(objetivos),
                descripcion: DOMPurify.sanitize(descripcion),
                recursos: DOMPurify.sanitize(recursos),
                estado: estado,
            };

            const response = await axios.post(
                "http://localhost:5000/temas/editarTema",
                datosFormulario,
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            const { temaEditadoBackend } = response.data;
            if (response.data.en === 1) {
                let temaActualizado = { ...temaParaEditar };
                temaActualizado.idTema = temaEditadoBackend.id;
                temaActualizado.titulo = temaEditadoBackend.titulo;
                temaActualizado.objetivos = temaEditadoBackend.objetivos;
                temaActualizado.descripcion = temaEditadoBackend.descripcion;
                temaActualizado.recursos = temaEditadoBackend.recursos;
                temaActualizado.estado = temaEditadoBackend.estado;
                setTemaSeleccionado(temaActualizado);

                const mensaje = `${usuarioDetalles.detallesPersona.nombres} editó el tema con el título: "${cleanHtmlTags(titulo)}"`;
                console.log(mensaje);

                // Llama al endpoint de historial para registrar el cambio
                const usuarioId = usuarioDetalles.id;
                axios
                    .post("http://localhost:5000/historial/registrarCambio", {
                        tipoEntidad: "tema",
                        idTema: temaParaEditar.idTema,
                        detalles: mensaje,
                        idUsuario: usuarioId,
                    })
                    .then((historialResponse) => {
                        if (historialResponse.data.en === 1) {
                            console.log("Cambio registrado en el historial");
                            cargarTemas();
                            handleClose();
                        } else {
                            console.log("No se pudo registrar el cambio en el historial");
                        }
                    })
                    .catch((error) => {
                        console.error("Error al registrar el cambio en el historial:", error);
                    });
            } else {
                console.log("No se pudo editar el tema");
            }
        } catch (error) {
            console.error("Error al editar el tema:", error);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={handleShow}
                disabled={!temaParaEditar}
            >
                Editar
            </Button>
            <Modal show={show} onHide={handleClose} size="xl" style={{zIndex:1500}}>
                <Modal.Header closeButton>
                    <Modal.Title>Edita el tema seleccionado</Modal.Title>
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
                    <Button variant="success" onClick={handleSubmit}>Guardar</Button>
                </Modal.Footer>
                <div>
                    {showAlert && (
                        <div className="custom-alert">
                            <span className="closebtn" onClick={() => setShowAlert(false)}>&times;</span>
                            Por favor completa todos los campos.
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}