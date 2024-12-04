import React, { useState, useRef, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Snackbar, Box } from "@mui/material";
import { styled } from '@mui/system';
import ReactQuill from "react-quill";
import Editor from "@monaco-editor/react";
import axios from "axios";
import DOMPurify from "dompurify";
import 'react-quill/dist/quill.snow.css';
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";

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

export default function ModalEditarSubtema({ cargarSubtemas, subtemaParaEditar, subtemas }) {
    const formRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [objetivos, setObjetivos] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [ejemploCodigo, setEjemploCodigo] = useState("");
    const [recursos, setRecursos] = useState("");
    const [retroalimentacion, setRetroalimentacion] = useState("");
    const [estado, setEstado] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    const { usuarioDetalles } = useSesionUsuario();
    const { setSubtemaSeleccionado } = useSubtemaSeleccionado();

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
        setRetroalimentacion(subtemaParaEditar.retroalimentacion);
        setEstado(subtemaParaEditar.estado);
    };

    const handleTituloChange = (content) => setTitulo(content);
    const handleObjetivosChange = (value) => setObjetivos(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleEjemploCodigoChange = (value) => setEjemploCodigo(value);
    const handleRecursosChange = (value) => setRecursos(value);
    const handleRetroalimentacionChange = (value) => setRetroalimentacion(value);
    const HOST = import.meta.env.VITE_HOST;

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

    const validarLongitudTitulo = (titulo) => {
        const tituloLimpio = cleanHtmlTags(titulo).trim();
        return tituloLimpio.length <= 255;
    };

    const tituloExistente = (nuevoTitulo) => {
        const tituloLimpio = cleanHtmlTags(nuevoTitulo).trim().toLowerCase();
        return subtemas?.some((subtema) =>
            subtema.idSubtema !== subtemaParaEditar.idSubtema &&
            cleanHtmlTags(subtema.titulo).trim().toLowerCase() === tituloLimpio
        );
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (
    //         !isQuillContentAvailable(titulo) ||
    //         !isQuillContentAvailable(objetivos) ||
    //         !isQuillContentAvailable(descripcion) ||
    //         !isQuillContentAvailable(ejemploCodigo) ||
    //         !isQuillContentAvailable(recursos) ||
    //         !isQuillContentAvailable(retroalimentacion)
    //     ) {
    //         setSnackbarMessage("Por favor completa todos los campos.");
    //         setSnackbarColor("error");
    //         return;
    //     }

    //     // Validar la longitud del título
    //     if (!validarLongitudTitulo(titulo)) {
    //         setSnackbarMessage("El título no puede exceder los 255 caracteres.");
    //         setSnackbarColor("error");
    //         return;
    //     }

    //     // Verificar si ya existe un subtema con el mismo título
    //     if (tituloExistente(titulo)) {
    //         setSnackbarMessage("Ya existe un subtema con este título.");
    //         setSnackbarColor("error");
    //         return;
    //     }

    //     try {
    //         const datosFormulario = {
    //             id: subtemaParaEditar.idSubtema,
    //             titulo: DOMPurify.sanitize(titulo),
    //             objetivos: DOMPurify.sanitize(objetivos),
    //             descripcion: DOMPurify.sanitize(descripcion),
    //             ejemploCodigo: ejemploCodigo,
    //             recursos: DOMPurify.sanitize(recursos),
    //             retroalimentacion: DOMPurify.sanitize(retroalimentacion),
    //             estado: estado,
    //         };

    //         const response = await axios.post(
    //             `${HOST}/subtemas/editarSubtema`,
    //             datosFormulario,
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     version: "1.0.0",
    //                 },
    //             }
    //         );

    //         const { subtemaEditadoBackend } = response.data;
    //         if (response.data.en === 1) {
    //             let subtemaActualizado = { ...subtemaParaEditar };
    //             subtemaActualizado.idSubtema = subtemaEditadoBackend.id;
    //             subtemaActualizado.titulo = subtemaEditadoBackend.titulo;
    //             subtemaActualizado.objetivos = subtemaEditadoBackend.objetivos;
    //             subtemaActualizado.descripcion = subtemaEditadoBackend.descripcion;
    //             subtemaActualizado.ejemploCodigo = subtemaEditadoBackend.ejemploCodigo;
    //             subtemaActualizado.recursos = subtemaEditadoBackend.recursos;
    //             subtemaActualizado.retroalimentacion = subtemaEditadoBackend.retroalimentacion;
    //             subtemaActualizado.estado = subtemaEditadoBackend.estado;
    //             setSubtemaSeleccionado(subtemaActualizado);

    //             cargarSubtemas();
    //             setSnackbarMessage("Subtema editado con éxito.");
    //             setSnackbarColor("success");
    //             handleClose();
    //         } else {
    //             setSnackbarMessage("No se pudo editar el subtema.");
    //             setSnackbarColor("error");
    //         }
    //     } catch (error) {
    //         console.error("Error al editar el subtema:", error);
    //         setSnackbarMessage("Error al editar el subtema.");
    //         setSnackbarColor("error");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !isQuillContentAvailable(titulo) ||
            !isQuillContentAvailable(objetivos) ||
            !isQuillContentAvailable(descripcion) ||
            !isQuillContentAvailable(ejemploCodigo) ||
            !isQuillContentAvailable(recursos) ||
            !isQuillContentAvailable(retroalimentacion)
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
            setSnackbarMessage("Ya existe un subtema con este título.");
            setSnackbarColor("error");
            return;
        }
    
        try {
            const datosFormulario = {
                id: subtemaParaEditar.idSubtema,
                titulo: DOMPurify.sanitize(titulo),
                objetivos: DOMPurify.sanitize(objetivos),
                descripcion: DOMPurify.sanitize(descripcion),
                ejemploCodigo: ejemploCodigo,
                recursos: DOMPurify.sanitize(recursos),
                retroalimentacion: DOMPurify.sanitize(retroalimentacion),
                estado: estado,
            };
    
            const response = await axios.post(
                `${HOST}/subtemas/editarSubtema`,
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
                subtemaActualizado.retroalimentacion = subtemaEditadoBackend.retroalimentacion;
                subtemaActualizado.estado = subtemaEditadoBackend.estado;
                setSubtemaSeleccionado(subtemaActualizado);
    
                // Agregar registro al historial
                const mensaje = `${usuarioDetalles.detallesPersona.nombres} editó el subtema con el título: "${cleanHtmlTags(titulo)}"`;
    
                await axios.post(`${HOST}/historial/registrarCambio`, {
                    tipoEntidad: "subtema",
                    idSubtema: subtemaParaEditar.idSubtema,
                    detalles: mensaje,
                    idUsuario: usuarioDetalles.id,
                });
    
                cargarSubtemas();
                setSnackbarMessage("Subtema editado con éxito.");
                setSnackbarColor("success");
                handleClose();
            } else {
                setSnackbarMessage("No se pudo editar el subtema.");
                setSnackbarColor("error");
            }
        } catch (error) {
            console.error("Error al editar el subtema:", error);
            setSnackbarMessage("Error al editar el subtema.");
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
                disabled={!subtemaParaEditar}
                size="small"
            >
                Editar
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>Edita el subtema seleccionado</DialogTitle>
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
                                        onChange={(newValue) => handleEjemploCodigoChange(newValue)}
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
                    },
                }}
            />
        </>
    );
}
