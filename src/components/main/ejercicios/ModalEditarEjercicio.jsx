import React, { useState, useRef, useEffect } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, IconButton, Snackbar,
    Container, TextField
} from "@mui/material";
import ReactQuill from "react-quill";
import Editor from "@monaco-editor/react";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import CloseIcon from '@mui/icons-material/Close';
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";

export default function ModalEditarEjercicio({ cargarEjercicios, ejercicioParaEditar }) {
    const { usuarioDetalles } = useSesionUsuario();
    const { setEjercicioSeleccionado } = useEjercicioSeleccionado();
    const [open, setOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [instrucciones, setInstrucciones] = useState("");
    const [restricciones, setRestricciones] = useState("");
    const [solucion, setSolucion] = useState("");
    const [retroalimentacion, setRetroalimentacion] = useState("");
    const [estado, setEstado] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    const formRef = useRef(null);

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
        setRetroalimentacion(ejercicioParaEditar.retroalimentacion);
        setEstado(ejercicioParaEditar.estado);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        limpiarCampos();
    };

    const handleTituloChange = (content) => setTitulo(content);
    const handleInstruccionesChange = (value) => setInstrucciones(value);
    const handleRestriccionesChange = (value) => setRestricciones(value);
    const handleSolucionChange = (value) => setSolucion(value);
    const handleRetroalimentacionChange = (value) => setRetroalimentacion(value);

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
            !isQuillContentAvailable(instrucciones) ||
            !isQuillContentAvailable(restricciones) ||
            !isQuillContentAvailable(solucion) ||
            !isQuillContentAvailable(retroalimentacion)
        ) {
            setSnackbarMessage("Por favor completa todos los campos.");
            setSnackbarColor("error");
            return;
        }

        try {
            await editarEjercicio();
            setSnackbarMessage("Ejercicio editado con éxito.");
            setSnackbarColor("success");
            handleClose();
        } catch (error) {
            console.error("Error al editar el ejercicio:", error);
            setSnackbarMessage("Error al editar el ejercicio.");
            setSnackbarColor("error");
        }
    };

    const editarEjercicio = async () => {
        const datosFormulario = {
            id: ejercicioParaEditar.idEjercicio,
            titulo: DOMPurify.sanitize(titulo),
            instrucciones: DOMPurify.sanitize(instrucciones),
            restricciones: DOMPurify.sanitize(restricciones),
            solucion: solucion,
            retroalimentacion: DOMPurify.sanitize(retroalimentacion),
            estado: estado,
        };

        const response = await axios.post(
            `http://localhost:5000/ejercicios/editarEjercicio`,
            datosFormulario,
            {
                headers: {
                    "Content-Type": "application/json",
                    version: "1.0.0",
                },
            }
        );

        const { ejercicioEditadoBackend } = response.data;

        if (response.data.en === 1) {
            let ejercicioActualizado = { ...ejercicioParaEditar };
            ejercicioActualizado.idEjercicio = ejercicioEditadoBackend.id;
            ejercicioActualizado.titulo = ejercicioEditadoBackend.titulo;
            ejercicioActualizado.instrucciones = ejercicioEditadoBackend.instrucciones;
            ejercicioActualizado.restricciones = ejercicioEditadoBackend.restricciones;
            ejercicioActualizado.solucion = ejercicioEditadoBackend.solucion;
            ejercicioActualizado.retroalimentacion = ejercicioEditadoBackend.retroalimentacion;
            ejercicioActualizado.estado = ejercicioEditadoBackend.estado;
            setEjercicioSeleccionado(ejercicioActualizado);

            const mensaje = `Se editó el ejercicio con el título: "${cleanHtmlTags(titulo)}"`;

            const usuarioId = usuarioDetalles.id;
            await axios.post(`http://localhost:5000/historial/registrarCambio`, {
                tipoEntidad: "ejercicio",
                idEjercicio: ejercicioParaEditar.idEjercicio,
                detalles: mensaje,
                idUsuario: usuarioId,
            });
            cargarEjercicios();
        } else {
            throw new Error("No se pudo editar el ejercicio.");
        }
    };

    const limpiarCampos = () => {
        setTitulo("");
        setInstrucciones("");
        setRestricciones("");
        setSolucion("");
        setRetroalimentacion("");
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen} disabled={!ejercicioParaEditar} size="small">
                Editar
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>
                    Edita el ejercicio seleccionado
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <form ref={formRef} onSubmit={handleSubmit}>
                                    <div>
                                        <Typography variant="body1" gutterBottom>Título (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={titulo}
                                            onChange={handleTituloChange}
                                            modules={{ toolbar: toolbarOptions }}
                                            className="small-textarea"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>Instrucciones (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={instrucciones}
                                            onChange={handleInstruccionesChange}
                                            modules={{ toolbar: toolbarOptions }}
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>Restricciones (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={restricciones}
                                            onChange={handleRestriccionesChange}
                                            modules={{ toolbar: toolbarOptions }}
                                        />
                                    </div>
                                    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                                        <Typography variant="body1" gutterBottom>Solución en código (campo obligatorio):</Typography>
                                        <Editor
                                            height="200px"
                                            defaultLanguage="c"
                                            value={solucion}
                                            onChange={handleSolucionChange}
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>Retroalimentación (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={retroalimentacion}
                                            onChange={handleRetroalimentacionChange}
                                            modules={{ toolbar: toolbarOptions }}
                                        />
                                    </div>
                                </form>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6">Previsualizar</Typography>
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(titulo) }} />
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(instrucciones) }} />
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(restricciones) }} />
                                <pre>{solucion}</pre>
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(retroalimentacion) }} />
                            </Grid>
                        </Grid>
                    </Container>
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
                open={Boolean(snackbarMessage)}
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
