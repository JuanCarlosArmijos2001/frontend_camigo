import React, { useState, useRef, useEffect } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, IconButton, Snackbar,
    Container, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import CloseIcon from '@mui/icons-material/Close';
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";

export default function ModalEditarPregunta({ cargarPreguntas, preguntaParaEditar }) {
    const { usuarioDetalles } = useSesionUsuario();
    const { setPreguntaSeleccionado } = usePreguntaSeleccionado();
    const [open, setOpen] = useState(false);
    const [enunciado, setEnunciado] = useState("");
    const [opcion_a, setOpcion_a] = useState("");
    const [opcion_b, setOpcion_b] = useState("");
    const [opcion_c, setOpcion_c] = useState("");
    const [opcion_d, setOpcion_d] = useState("");
    const [respuesta_correcta, setRespuesta_correcta] = useState("");
    const [justificacion, setJustificacion] = useState("");
    const [estado, setEstado] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    const formRef = useRef(null);

    useEffect(() => {
        if (preguntaParaEditar) {
            obtenerDatosPregunta();
        }
    }, [preguntaParaEditar]);

    const obtenerDatosPregunta = () => {
        setEnunciado(preguntaParaEditar.enunciado);
        setOpcion_a(preguntaParaEditar.opcion_a);
        setOpcion_b(preguntaParaEditar.opcion_b);
        setOpcion_c(preguntaParaEditar.opcion_c);
        setOpcion_d(preguntaParaEditar.opcion_d);        
        setRespuesta_correcta(preguntaParaEditar.respuesta_correcta);
        setJustificacion(preguntaParaEditar.justificacion);
        setEstado(preguntaParaEditar.estado);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        limpiarCampos();
    };

    const handleEnunciadoChange = (content) => setEnunciado(content);
    const handleOpcion_a_Change = (value) => setOpcion_a(value);
    const handleOpcion_b_Change = (value) => setOpcion_b(value);
    const handleOpcion_c_Change = (value) => setOpcion_c(value);
    const handleOpcion_d_Change = (value) => setOpcion_d(value);
    const handleJustificacionChange = (value) => setJustificacion(value);

    const toolbarOptions = [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
    ];

    const cleanEmptyParagraphs = (content) => {
        if (content) {
            return content.replace(/<p><br><\/p>/g, "");
        }
        return "";
    };

    const isQuillContentAvailable = (content) => {
        return content.replace(/<[^>]+>/g, "").trim().length > 0;
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !isQuillContentAvailable(enunciado) ||
            !isQuillContentAvailable(opcion_a) ||
            !isQuillContentAvailable(opcion_b) ||
            !isQuillContentAvailable(opcion_c) ||
            !isQuillContentAvailable(opcion_d) ||
            !respuesta_correcta ||
            !isQuillContentAvailable(justificacion)
        ) {
            setSnackbarMessage("Por favor completa todos los campos.");
            setSnackbarColor("error");
            return;
        }

        try {
            await editarPregunta();
            setSnackbarMessage("Pregunta editada con éxito.");
            setSnackbarColor("success");
            handleClose();
        } catch (error) {
            console.error("Error al editar la pregunta:", error);
            setSnackbarMessage("Error al editar la pregunta.");
            setSnackbarColor("error");
        }
    };

    const editarPregunta = async () => {
        const datosFormulario = {
            id: preguntaParaEditar.idPregunta,
            enunciado: DOMPurify.sanitize(enunciado),
            opcion_a: DOMPurify.sanitize(opcion_a),
            opcion_b: DOMPurify.sanitize(opcion_b),
            opcion_c: DOMPurify.sanitize(opcion_c),
            opcion_d: DOMPurify.sanitize(opcion_d),
            respuesta_correcta: DOMPurify.sanitize(respuesta_correcta),
            justificacion: DOMPurify.sanitize(justificacion),
            estado: estado,
        };

        const response = await axios.post(
            `http://localhost:5000/preguntas/editarPregunta`,
            datosFormulario,
            {
                headers: {
                    "Content-Type": "application/json",
                    version: "1.0.0",
                },
            }
        );

        const { preguntaEditadaBackend } = response.data;

        if (response.data.en === 1) {
            let preguntaActualizada = { ...preguntaParaEditar, ...preguntaEditadaBackend };
            setPreguntaSeleccionado(preguntaActualizada);

            const mensaje = `Se editó la pregunta con el enunciado: "${cleanHtmlTags(enunciado)}"`;

            const usuarioId = usuarioDetalles.id;
            await axios.post(`http://localhost:5000/historial/registrarCambio`, {
                tipoEntidad: "pregunta",
                idPregunta: preguntaParaEditar.idPregunta,
                detalles: mensaje,
                idUsuario: usuarioId,
            });
            cargarPreguntas();
        } else {
            throw new Error("No se pudo editar la pregunta.");
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
            <Button variant="contained" color="primary" onClick={handleOpen} disabled={!preguntaParaEditar} size="small">
                Editar
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>
                    Edita la pregunta de control seleccionada
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
                                        <Typography variant="body1" gutterBottom>Enunciado (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={enunciado}
                                            onChange={handleEnunciadoChange}
                                            modules={{ toolbar: toolbarOptions }}
                                            className="small-textarea"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>Primera opción (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={opcion_a}
                                            onChange={handleOpcion_a_Change}
                                            modules={{ toolbar: toolbarOptions }}
                                            className="small-textarea"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>Segunda opción (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={opcion_b}
                                            onChange={handleOpcion_b_Change}
                                            modules={{ toolbar: toolbarOptions }}
                                            className="small-textarea"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>Tercera opción (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={opcion_c}
                                            onChange={handleOpcion_c_Change}
                                            modules={{ toolbar: toolbarOptions }}
                                            className="small-textarea"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>Cuarta opción (campo obligatorio):</Typography>
                                        <ReactQuill
                                            value={opcion_d}
                                            onChange={handleOpcion_d_Change}
                                            modules={{ toolbar: toolbarOptions }}
                                            className="small-textarea"
                                        />
                                    </div>
                                    <div>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="respuesta-correcta-label">Respuesta correcta</InputLabel>
                                            <Select
                                                labelId="respuesta-correcta-label"
                                                value={respuesta_correcta}
                                                onChange={(e) => setRespuesta_correcta(e.target.value)}
                                                label="Respuesta correcta"
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
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(enunciado) }} />
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(opcion_a) }} />
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(opcion_b) }} />
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(opcion_c) }} />
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(opcion_d) }} />
                                <div dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(justificacion) }} />
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