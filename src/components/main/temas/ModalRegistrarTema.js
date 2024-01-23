import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Toast } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import "react-quill/dist/quill.snow.css";
import "../../../assets/styles/components/main/temas/modalRegistrarTema.css";

export default function ModalRegistrarTema({ cargarTemas, temas }) {
    const formRef = useRef(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [titulo, setTitulo] = useState("");
    const [objetivos, setObjetivos] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [recursos, setRecursos] = useState("");
    const { usuarioDetalles } = useSesionUsuario();
    const [showAlert, setShowAlert] = useState(false);

    const handleTituloChange = (content) => {
        setTitulo(content);
    };

    const handleObjetivosChange = (value) => setObjetivos(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleRecursosChange = (value) => setRecursos(value);

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

    //Controles para evitar que se envíe el formulario vacío
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(temas);
        if (
            !isQuillContentAvailable(titulo) ||
            !isQuillContentAvailable(objetivos) ||
            !isQuillContentAvailable(descripcion) ||
            !isQuillContentAvailable(recursos)
        ) {
            setShowAlert("Por favor completa todos los campos.");
            return;
        }

        if (tituloExistente(titulo)) {
            setShowAlert("El tema ya existe.");
            return;
        }

        await crearTema();
        setTitulo("");
        setObjetivos("");
        setDescripcion("");
        setRecursos("");
    };

    const tituloExistente = (titulo) => {
        if (temas) {
            return temas.some((tema) => {
                if (tema.titulo === titulo) {
                    return true;
                }
                return false;
            });
        }
        return false;
    };

    const crearTema = async () => {
        try {
            const datosFormulario = {
                titulo: DOMPurify.sanitize(titulo),
                objetivos: DOMPurify.sanitize(objetivos),
                descripcion: DOMPurify.sanitize(descripcion),
                recursos: DOMPurify.sanitize(recursos),
            };

            const response = await axios.post(
                "http://localhost:5000/temas/registrarTema",
                datosFormulario,
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            console.log("Respuesta del servidor al crear el tema:", response.data);

            if (response.data.en === 1) {
                const nuevoTemaId = response.data.idTema; // Obtén el ID del tema creado
                const mensaje = `${usuarioDetalles.detallesPersona.nombres} creó el tema con el título: "${cleanHtmlTags(titulo)}"`;

                console.log(mensaje);

                // Llama al endpoint de historial para registrar el cambio
                const personaId = usuarioDetalles ? usuarioDetalles.detallesPersona.id : null;
                axios
                    .post("http://localhost:5000/historial/registrarCambio", {
                        tipoEntidad: "tema",
                        idTema: nuevoTemaId,
                        detalles: mensaje,
                        personaId: personaId,
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
                console.log("No se pudo crear el tema");
            }
        } catch (error) {
            console.error("Error al crear el tema:", error);
        }
    };


    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Crear
            </Button>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Crea un nuevo tema</Modal.Title>
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