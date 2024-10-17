import React, { useState, useRef } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography,
    IconButton, Snackbar, FormControl, Select, MenuItem, Box
} from "@mui/material";
import { styled } from '@mui/system';
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
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

export default function ModalRegistrarPreguntas({ cargarPreguntas, preguntas }) {
    const formRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [enunciado, setEnunciado] = useState("");
    const [opcion_a, setOpcion_a] = useState("");
    const [opcion_b, setOpcion_b] = useState("");
    const [opcion_c, setOpcion_c] = useState("");
    const [opcion_d, setOpcion_d] = useState("");
    const [respuesta_correcta, setRespuesta_correcta] = useState("");
    const [justificacion, setJustificacion] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        limpiarCampos();
        setOpen(false);
    };

    const handleEnunciadoChange = (content) => setEnunciado(content);
    const handleOpcion_a_Change = (value) => setOpcion_a(value);
    const handleOpcion_b_Change = (value) => setOpcion_b(value);
    const handleOpcion_c_Change = (value) => setOpcion_c(value);
    const handleOpcion_d_Change = (value) => setOpcion_d(value);
    const handleRespuesta_correcta_Change = (value) => setRespuesta_correcta(value);
    const handleJustificacionChange = (value) => setJustificacion(value);

    const toolbarOptions = [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
    ];

    const cleanEmptyParagraphs = (content) => {
        if (typeof content === "string" || content instanceof String) {
            return content.replace(/<p><br><\/p>/g, "");
        }
        return content;
    };

    const isQuillContentAvailable = (content) => {
        if (typeof content === "string" || content instanceof String) {
            const textOnly = content.replace(/<[^>]+>/g, "").trim();
            return textOnly.length > 0;
        }
        return false;
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const preguntaExistente = (enunciado) => {
        const enunciadoLimpio = cleanHtmlTags(enunciado).toLowerCase();
        return preguntas?.some((pregunta) => cleanHtmlTags(pregunta.enunciado).toLowerCase() === enunciadoLimpio);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !isQuillContentAvailable(enunciado) ||
            !isQuillContentAvailable(opcion_a) ||
            !isQuillContentAvailable(opcion_b) ||
            !isQuillContentAvailable(opcion_c) ||
            !isQuillContentAvailable(opcion_d) ||
            !isQuillContentAvailable(justificacion) ||
            !respuesta_correcta
        ) {
            setSnackbarMessage("Por favor completa todos los campos.");
            setSnackbarColor("error");
            return;
        }

        if (preguntaExistente(enunciado)) {
            setSnackbarMessage("La pregunta ya existe.");
            setSnackbarColor("error");
            return;
        }

        try {
            await crearPregunta();
            setSnackbarMessage("Pregunta creada con éxito.");
            setSnackbarColor("success");
            handleClose();
        } catch (error) {
            console.error("Error al crear la pregunta:", error);
            setSnackbarMessage("Error al crear la pregunta.");
            setSnackbarColor("error");
        }
    };


    const crearPregunta = async () => {
        const datosFormulario = {
            enunciado: DOMPurify.sanitize(enunciado),
            opcion_a: DOMPurify.sanitize(opcion_a),
            opcion_b: DOMPurify.sanitize(opcion_b),
            opcion_c: DOMPurify.sanitize(opcion_c),
            opcion_d: DOMPurify.sanitize(opcion_d),
            respuesta_correcta: DOMPurify.sanitize(respuesta_correcta),
            justificacion: DOMPurify.sanitize(justificacion),
            idEjercicio: ejercicioSeleccionado.idEjercicio,
        };

        const response = await axios.post(
            `http://localhost:5000/preguntas/registrarPregunta`,
            datosFormulario,
            {
                headers: {
                    "Content-Type": "application/json",
                    version: "1.0.0",
                },
            }
        );

        if (response.data.en === 1) {
            const nuevaPreguntaId = response.data.idPregunta;
            const mensaje = `${usuarioDetalles.detallesPersona.nombres} creó la pregunta con el enunciado: "${cleanHtmlTags(enunciado)}"`;

            await axios.post(`http://localhost:5000/historial/registrarCambio`, {
                tipoEntidad: "pregunta",
                idPregunta: nuevaPreguntaId,
                detalles: mensaje,
                idUsuario: usuarioDetalles.id,
            });

            if (typeof cargarPreguntas === 'function') {
                cargarPreguntas();
            } else {
                console.warn("cargarPreguntas no es una función o no está definida");
            }
        } else {
            throw new Error("No se pudo crear la pregunta.");
        }
    };

    const limpiarCampos = () => {
        setEnunciado("");
        setOpcion_a("");
        setOpcion_b("");
        setOpcion_c("");
        setOpcion_d("");
        setRespuesta_correcta("");
        setJustificacion("");
    };

    return (
        <>
            <Button variant="contained" color="success" onClick={handleOpen} size="small">
                Crear
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>
                    Crea una nueva pregunta de control
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
                                    <Typography variant="body1" gutterBottom>Enunciado (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={enunciado}
                                        onChange={handleEnunciadoChange}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Primera opción (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={opcion_a}
                                        onChange={handleOpcion_a_Change}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Segunda opción (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={opcion_b}
                                        onChange={handleOpcion_b_Change}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Tercera opción (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={opcion_c}
                                        onChange={handleOpcion_c_Change}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Cuarta opción (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={opcion_d}
                                        onChange={handleOpcion_d_Change}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Respuesta correcta (campo obligatorio):</Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            value={respuesta_correcta}
                                            onChange={(e) => setRespuesta_correcta(e.target.value)}
                                        >
                                            <MenuItem value="">Selecciona la respuesta correcta</MenuItem>
                                            <MenuItem value="a">Opción A</MenuItem>
                                            <MenuItem value="b">Opción B</MenuItem>
                                            <MenuItem value="c">Opción C</MenuItem>
                                            <MenuItem value="d">Opción D</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>Justificación (campo obligatorio):</Typography>
                                    <ReactQuill
                                        value={justificacion}
                                        onChange={handleJustificacionChange}
                                        modules={{ toolbar: toolbarOptions }}
                                    />
                                </div>
                            </form>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Previsualizar</Typography>
                            <CompactPreview>
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(enunciado) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(opcion_a) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(opcion_b) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(opcion_c) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(opcion_d) }} />
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(justificacion) }} />
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
                autoHideDuration={6000}
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