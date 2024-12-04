import React, { useState, useRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Snackbar, Box } from "@mui/material";
import { styled } from '@mui/system';
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import 'react-quill/dist/quill.snow.css';

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

export default function ModalRegistrarTema({ cargarTemasGestionar, cargarTemasGeneral, temas }) {
    const formRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [objetivos, setObjetivos] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [recursos, setRecursos] = useState("");
    const { usuarioDetalles } = useSesionUsuario();
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    const HOST = import.meta.env.VITE_HOST;

    const handleClose = () => {
        limpiarCampos();
        setOpen(false);
    };

    const handleOpen = () => setOpen(true);

    const handleTituloChange = (content) => setTitulo(content);
    const handleObjetivosChange = (value) => setObjetivos(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleRecursosChange = (value) => setRecursos(value);

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

        if (!validarLongitudTitulo(titulo)) {
            setSnackbarMessage("El título no puede exceder los 255 caracteres.");
            setSnackbarColor("error");
            return;
        }

        if (tituloExistente(titulo)) {
            setSnackbarMessage("El tema ya existe.");
            setSnackbarColor("error");
            return;
        }

        try {
            await crearTema();
            limpiarCampos();
            setSnackbarMessage("Tema creado con éxito.");
            setSnackbarColor("success");
            handleClose();
        } catch (error) {
            console.error("Error al crear el tema:", error);
            setSnackbarMessage("Error al crear el tema.");
            setSnackbarColor("error");
        }
    };

    const limpiarCampos = () => {
        setTitulo("");
        setObjetivos("");
        setDescripcion("");
        setRecursos("");
    };

    const tituloExistente = (nuevoTitulo) => {
        const tituloLimpio = cleanHtmlTags(nuevoTitulo).trim();
        return temas?.some((tema) => cleanHtmlTags(tema.titulo).trim() === tituloLimpio);
    };

    const validarLongitudTitulo = (titulo) => {
        const tituloLimpio = cleanHtmlTags(titulo).trim();
        return tituloLimpio.length <= 255;
    };

    const crearTema = async () => {
        const datosFormulario = {
            titulo: DOMPurify.sanitize(titulo),
            objetivos: DOMPurify.sanitize(objetivos),
            descripcion: DOMPurify.sanitize(descripcion),
            recursos: DOMPurify.sanitize(recursos),
            idUsuario: usuarioDetalles.id,
        };

        const response = await axios.post(
            `${HOST}/temas/registrarTema`,
            datosFormulario,
            {
                headers: {
                    "Content-Type": "application/json",
                    version: "1.0.0",
                },
            }
        );

        if (response.data.en === 1) {
            const nuevoTemaId = response.data.idTema;
            const mensaje = `${usuarioDetalles.detallesPersona.nombres} creó el tema con el título: "${cleanHtmlTags(titulo)}"`;

            await axios.post(`${HOST}/historial/registrarCambio`, {
                tipoEntidad: "tema",
                idTema: nuevoTemaId,
                detalles: mensaje,
                idUsuario: usuarioDetalles.id,
            });

            cargarTemasGestionar();
            if (typeof cargarTemasGeneral === 'function') {
                cargarTemasGeneral();
            } else {
                console.error("cargarTemasGeneral no es una función");
            }
        } else {
            throw new Error("No se pudo crear el tema.");
        }
    };

    return (
        <>
            <Button variant="contained" color="success" onClick={handleOpen} size="small">
                Crear
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>Crea un nuevo tema</DialogTitle>
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
                            <CompactPreview>
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(titulo) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(objetivos) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(descripcion) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(recursos) }} />
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
                    },
                }}
            />
        </>
    );
}
