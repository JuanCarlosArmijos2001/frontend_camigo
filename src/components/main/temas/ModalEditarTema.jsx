import React, { useState, useRef, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Snackbar } from "@mui/material";
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import 'react-quill/dist/quill.snow.css';
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";

export default function ModalEditarTema({ cargarTemasGestionar, cargarTemasGeneral, temaParaEditar }) {
    const formRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [objetivos, setObjetivos] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [recursos, setRecursos] = useState("");
    const [estado, setEstado] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    const { usuarioDetalles } = useSesionUsuario();
    const { setTemaSeleccionado } = useTemaSeleccionado();

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

    const handleTituloChange = (content) => setTitulo(content);
    const handleObjetivosChange = (value) => setObjetivos(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleRecursosChange = (value) => setRecursos(value);

    const toolbarOptions = [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
    ];

    const cleanEmptyParagraphs = (content) => content.replace(/<p><br><\/p>/g, "");

    const isQuillContentAvailable = (content) => content.replace(/<[^>]+>/g, "").trim().length > 0;

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
            !isQuillContentAvailable(recursos)
        ) {
            setSnackbarMessage("Por favor completa todos los campos.");
            setSnackbarColor("error");
            return;
        }

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
                `http://localhost:5000/temas/editarTema`,
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

                await axios.post(`http://localhost:5000/historial/registrarCambio`, {
                    tipoEntidad: "tema",
                    idTema: temaParaEditar.idTema,
                    detalles: mensaje,
                    idUsuario: usuarioDetalles.id,
                });

                cargarTemasGestionar();
                if (typeof cargarTemasGeneral === 'function') {
                    cargarTemasGeneral();  // Llamada segura
                } else {
                    console.error("cargarTemasGeneral no es una función");
                }
                setSnackbarMessage("Tema editado con éxito.");
                setSnackbarColor("success");
                handleClose();
            } else {
                setSnackbarMessage("No se pudo editar el tema.");
                setSnackbarColor("error");
            }
        } catch (error) {
            console.error("Error al editar el tema:", error);
            setSnackbarMessage("Error al editar el tema.");
            setSnackbarColor("error");
        }
    };

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                disabled={!temaParaEditar}
                size="small"
            >
                Editar
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>Edita el tema seleccionado</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <form ref={formRef} onSubmit={handleSubmit}>
                                <div>
                                    <Typography variant="body1" gutterBottom>Título (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={titulo}
                                        onChange={handleTituloChange}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Objetivos de aprendizaje (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={objetivos}
                                        onChange={handleObjetivosChange}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Descripción (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={descripcion}
                                        onChange={handleDescripcionChange}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Recursos adicionales (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={recursos}
                                        onChange={handleRecursosChange}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                            </form>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Previsualizar</Typography>
                            <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(titulo) }} />
                            <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(objetivos) }} />
                            <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(descripcion) }} />
                            <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(recursos) }} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="success">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={() => setSnackbarMessage("")}
                message={snackbarMessage}
                ContentProps={{
                    style: {
                        backgroundColor: snackbarColor === "success" ? "#4caf50" : "#f44336",
                    },
                }}
            />
        </>
    );
}