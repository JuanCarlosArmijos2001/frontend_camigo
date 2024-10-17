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
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
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

export default function ModalRegistrarSubtema({ cargarSubtemas, subtemas }) {
    const formRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [objetivos, setObjetivos] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [ejemploCodigo, setEjemploCodigo] = useState("");
    const [recursos, setRecursos] = useState("");
    const [retroalimentacion, setRetroalimentacion] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    const { temaSeleccionado } = useTemaSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        limpiarCampos();
        setOpen(false);
    };

    const handleTituloChange = (content) => setTitulo(content);
    const handleObjetivosChange = (value) => setObjetivos(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleEjemploCodigoChange = (value) => setEjemploCodigo(value);
    const handleRecursosChange = (value) => setRecursos(value);
    const handleRetroalimentacionChange = (value) => setRetroalimentacion(value);

    const toolbarOptions = [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        [{ 'code-block': 'code' }]
    ];

    const cleanEmptyParagraphs = (content) => content.replace(/<p><br><\/p>/g, "");

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const isQuillContentAvailable = (content) => content.replace(/<[^>]+>/g, "").trim().length > 0;

    const validarLongitudTitulo = (titulo) => {
        const tituloLimpio = cleanHtmlTags(titulo).trim();
        return tituloLimpio.length <= 255;
    };

    const tituloExistente = (nuevoTitulo) => {
        const tituloLimpio = cleanHtmlTags(nuevoTitulo).trim();
        return subtemas?.some((subtema) => cleanHtmlTags(subtema.titulo).trim() === tituloLimpio);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !isQuillContentAvailable(titulo) ||
            !isQuillContentAvailable(objetivos) ||
            !isQuillContentAvailable(descripcion) ||
            !ejemploCodigo.trim() ||
            !isQuillContentAvailable(recursos) ||
            !isQuillContentAvailable(retroalimentacion)
        ) {
            setSnackbarMessage("Por favor completa todos los campos.");
            setSnackbarColor("error");
            return;
        }

        // 3. Validar longitud del título
        if (!validarLongitudTitulo(titulo)) {
            setSnackbarMessage("El título no puede exceder los 255 caracteres.");
            setSnackbarColor("error");
            return;
        }

        if (tituloExistente(titulo)) {
            setSnackbarMessage("El subtema ya existe.");
            setSnackbarColor("error");
            return;
        }

        try {
            await crearSubtema();
            setSnackbarMessage("Subtema creado con éxito.");
            setSnackbarColor("success");
            handleClose();
        } catch (error) {
            console.error("Error al crear el subtema:", error);
            setSnackbarMessage("Error al crear el subtema.");
            setSnackbarColor("error");
        }
    };


    const crearSubtema = async () => {
        const datosFormulario = {
            titulo: DOMPurify.sanitize(titulo),
            objetivos: DOMPurify.sanitize(objetivos),
            descripcion: DOMPurify.sanitize(descripcion),
            ejemploCodigo: ejemploCodigo,
            recursos: DOMPurify.sanitize(recursos),
            retroalimentacion: DOMPurify.sanitize(retroalimentacion),
            idTema: temaSeleccionado.idTema,
        };

        const response = await axios.post(
            `http://localhost:5000/subtemas/registrarSubtema`,
            datosFormulario,
            {
                headers: {
                    "Content-Type": "application/json",
                    version: "1.0.0",
                },
            }
        );

        if (response.data.en === 1) {
            const nuevoSubtemaId = response.data.idSubtema;
            const mensaje = `${usuarioDetalles.detallesPersona.nombres} creó el subtema con el título: "${cleanHtmlTags(titulo)}"`;

            await axios.post(`http://localhost:5000/historial/registrarCambio`, {
                tipoEntidad: "subtema",
                idSubtema: nuevoSubtemaId,
                detalles: mensaje,
                idUsuario: usuarioDetalles.id,
            });

            if (typeof cargarSubtemas === 'function') {
                cargarSubtemas();
            } else {
                console.warn("cargarSubtemas no es una función o no está definida");
            }
        } else {
            throw new Error("No se pudo crear el subtema.");
        }
    };

    const limpiarCampos = () => {
        setTitulo("");
        setObjetivos("");
        setDescripcion("");
        setEjemploCodigo("");
        setRecursos("");
        setRetroalimentacion("");
    };

    return (
        <>
            <Button variant="contained" color="success" onClick={handleOpen} size="small">
                Crear
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>
                    Crea un nuevo subtema
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
                                    <Typography variant="body1" gutterBottom>Ejemplo de código (campo obligatorio):</Typography>
                                    <Editor
                                        height="200px"
                                        defaultLanguage="c"
                                        value={ejemploCodigo}
                                        onChange={handleEjemploCodigoChange}
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
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(objetivos) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(descripcion) }} />
                                <pre>{ejemploCodigo}</pre>
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(recursos) }} />
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