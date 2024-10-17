import React, { useState, useRef } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography,
    IconButton, Snackbar, Box
} from "@mui/material";
import { styled } from '@mui/system';
import ReactQuill from "react-quill";
import Editor from "@monaco-editor/react";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import CloseIcon from '@mui/icons-material/Close';

const CompactPreview = styled(Box)(({ theme }) => ({
    '& .ql-editor': {
        padding: theme.spacing(1, 0),
        margin: 0,
        '& > *:first-child': {
            marginTop: 0,
        },
        '& > *:last-child': {
            marginBottom: 0,
        },
        '& p, & ul, & ol, & h1, & h2, & h3, & h4, & h5, & h6': {
            textAlign: 'justify',
            margin: theme.spacing(1, 0),
        },
    },
    '& > .ql-editor + .ql-editor': {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
}));


export default function ModalRegistrarEjercicio({ cargarEjercicios, ejercicios }) {
    const formRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [instrucciones, setInstrucciones] = useState("");
    const [restricciones, setRestricciones] = useState("");
    const [solucion, setSolucion] = useState("");
    const [retroalimentacion, setRetroalimentacion] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    const { subtemaSeleccionado } = useSubtemaSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        limpiarCampos();
        setOpen(false);
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

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const isQuillContentAvailable = (content) => content.replace(/<[^>]+>/g, "").trim().length > 0;

    const tituloExistente = (titulo) => {
        const tituloLimpio = cleanHtmlTags(titulo).toLowerCase();
        return ejercicios?.some((ejercicio) => cleanHtmlTags(ejercicio.titulo).toLowerCase() === tituloLimpio);
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
    
        if (tituloExistente(titulo)) {
            setSnackbarMessage("El ejercicio ya existe.");
            setSnackbarColor("error");
            return;
        }
    
        try {
            await crearEjercicio();
            setSnackbarMessage("Ejercicio creado con éxito.");
            setSnackbarColor("success");
            handleClose();
        } catch (error) {
            console.error("Error al crear el ejercicio:", error);
            setSnackbarMessage("Error al crear el ejercicio.");
            setSnackbarColor("error");
        }
    };    

    const crearEjercicio = async () => {
        const datosFormulario = {
            titulo: DOMPurify.sanitize(titulo),
            instrucciones: DOMPurify.sanitize(instrucciones),
            restricciones: DOMPurify.sanitize(restricciones),
            solucion: solucion,
            retroalimentacion: DOMPurify.sanitize(retroalimentacion),
            idSubtema: subtemaSeleccionado.idSubtema,
        };

        const response = await axios.post(
            `http://localhost:5000/ejercicios/registrarEjercicio`,
            datosFormulario,
            {
                headers: {
                    "Content-Type": "application/json",
                    version: "1.0.0",
                },
            }
        );

        if (response.data.en === 1) {
            const nuevoEjercicioId = response.data.idEjercicio;
            const mensaje = `${usuarioDetalles.detallesPersona.nombres} creó el ejercicio con el título: "${cleanHtmlTags(titulo)}"`;

            await axios.post(`http://localhost:5000/historial/registrarCambio`, {
                tipoEntidad: "ejercicio",
                idEjercicio: nuevoEjercicioId,
                detalles: mensaje,
                idUsuario: usuarioDetalles.id,
            });

            if (typeof cargarEjercicios === 'function') {
                cargarEjercicios();
            } else {
                console.warn("cargarEjercicios no es una función o no está definida");
            }
        } else {
            throw new Error("No se pudo crear el ejercicio.");
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
            <Button variant="contained" color="success" onClick={handleOpen} size="small">
                Crear
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>
                    Crea un nuevo ejercicio
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
                                <div>
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
                            <CompactPreview>
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(titulo) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(instrucciones) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(restricciones) }} />
                                <pre>{solucion}</pre>
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(retroalimentacion) }} />
                            </CompactPreview>
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
                autoHideDuration={2000}
                onClose={() => setSnackbarMessage("")}
                message={snackbarMessage}
                ContentProps={{
                    style: {
                        backgroundColor: snackbarColor === "success" ? "#4caf50" : "#f44336",
                        color: "#fff",
                    },
                }}
            />
        </>
    );
}
