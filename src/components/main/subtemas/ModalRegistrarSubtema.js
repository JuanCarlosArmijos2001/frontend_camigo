import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Toast } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import axios from "axios";
import Editor from "@monaco-editor/react";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import "../../../assets/styles/components/main/temas/modalRegistrarTema.css";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";

export default function ModalRegistrarSubtema({ cargarSubtemas, subtemas }) {
    const formRef = useRef(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [titulo, setTitulo] = useState("");
    const [objetivos, setObjetivos] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [ejemploCodigo, setEjemploCodigo] = useState("");
    const [recursos, setRecursos] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const { temaSeleccionado } = useTemaSeleccionado();

    const handleTituloChange = (content) => {
        setTitulo(content);
    };

    const handleObjetivosChange = (value) => setObjetivos(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleEjemploCodigoChange = (value) => setEjemploCodigo(value);
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

    const isQuillContentAvailable = (content) => {
        const textOnly = content.replace(/<[^>]+>/g, "").trim();
        return textOnly.length > 0;
    };

    //Controles para evitar que se envíe el formulario vacío
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !isQuillContentAvailable(titulo) ||
            !isQuillContentAvailable(objetivos) ||
            !isQuillContentAvailable(descripcion) ||
            !isQuillContentAvailable(ejemploCodigo) ||
            !isQuillContentAvailable(recursos)
        ) {
            setShowAlert("Por favor completa todos los campos.");
            return;
        }

        if (tituloExistente(titulo)) {
            setShowAlert("El subtema ya existe.");
            return;
        }

        await crearSubtema();
        setTitulo("");
        setObjetivos("");
        setDescripcion("");
        setEjemploCodigo("");
        setRecursos("");
    };

    const tituloExistente = (titulo) => {
        if (subtemas) {
            return subtemas.some((subtema) => {
                if (subtema.titulo === titulo) {
                    return true;
                }
                return false;
            });
        }
        return false;
    };

    const crearSubtema = async () => {
        try {
            const datosFormulario = {
                titulo: DOMPurify.sanitize(titulo),
                objetivos: DOMPurify.sanitize(objetivos),
                descripcion: DOMPurify.sanitize(descripcion),
                ejemploCodigo: DOMPurify.sanitize(ejemploCodigo),
                recursos: DOMPurify.sanitize(recursos),
                idTema: temaSeleccionado.id,
            };

            const response = await axios.post(
                "http://localhost:5000/subtemas/registrarSubtema",
                datosFormulario,
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            if (response.data.en === 1) {
                console.log("Se creó el subtema correctamente");
                cargarSubtemas();
                handleClose();
            } else {
                console.log("No se pudo crear el subtema");
            }
        } catch (error) {
            console.error("Error al crear el subtema:", error);
        }
    };

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Crear
            </Button>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Crea un nuevo subtema</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid id="contenedor">
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
                                        <div
                                            className="grupoFormulario"
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "10px",
                                                borderRadius: "5px",
                                            }}
                                        >
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
                                    <h2>Vista previa</h2>
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
