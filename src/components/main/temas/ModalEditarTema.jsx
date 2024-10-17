import React, { useState, useRef, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Snackbar, Box } from "@mui/material";
import { styled } from '@mui/system';
import ReactQuill from "react-quill";
import axios from "axios";
import DOMPurify from "dompurify";
import 'react-quill/dist/quill.snow.css';
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";

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

export default function ModalEditarTema({ cargarTemasGestionar, cargarTemasGeneral, temaParaEditar, temas }) {
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

    const validarLongitudTitulo = (titulo) => {
        const tituloLimpio = cleanHtmlTags(titulo).trim();
        return tituloLimpio.length <= 255;
    };

    const tituloExistente = (nuevoTitulo) => {
        const tituloLimpio = cleanHtmlTags(nuevoTitulo).trim().toLowerCase();
        return temas?.some((tema) =>
            tema.idTema !== temaParaEditar.idTema &&
            cleanHtmlTags(tema.titulo).trim().toLowerCase() === tituloLimpio
        );
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

        if (!validarLongitudTitulo(titulo)) {
            setSnackbarMessage("El título no puede exceder los 255 caracteres.");
            setSnackbarColor("error");
            return;
        }

        if (tituloExistente(titulo)) {
            setSnackbarMessage("Ya existe un tema con este título.");
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


// import React, { useState, useRef, useEffect } from "react";
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Snackbar, Box } from "@mui/material";
// import { styled } from '@mui/system';
// import ReactQuill from "react-quill";
// import axios from "axios";
// import DOMPurify from "dompurify";
// import 'react-quill/dist/quill.snow.css';
// import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
// import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";

// const JustifiedContent = styled(Box)(({ theme }) => ({
//     '& .ql-editor, & > div': {
//         textAlign: 'justify',
//         '& p, & ul, & ol, & h1, & h2, & h3, & h4, & h5, & h6': {
//             textAlign: 'justify !important',
//         },
//         '& *': {
//             textAlign: 'justify !important',
//         },
//     },
// }));

// const PreviewSection = styled(Box)(({ theme }) => ({
//     border: `1px solid ${theme.palette.divider}`,
//     borderRadius: theme.shape.borderRadius,
//     padding: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//     '& > h6': {
//         marginBottom: theme.spacing(1),
//     },
// }));

// export default function ModalEditarTema({ cargarTemasGestionar, cargarTemasGeneral, temaParaEditar, temas }) {
//     const formRef = useRef(null);
//     const [open, setOpen] = useState(false);
//     const [titulo, setTitulo] = useState("");
//     const [objetivos, setObjetivos] = useState("");
//     const [descripcion, setDescripcion] = useState("");
//     const [recursos, setRecursos] = useState("");
//     const [estado, setEstado] = useState(0);
//     const [snackbarMessage, setSnackbarMessage] = useState("");
//     const [snackbarColor, setSnackbarColor] = useState("success");
//     const { usuarioDetalles } = useSesionUsuario();
//     const { setTemaSeleccionado } = useTemaSeleccionado();

//     useEffect(() => {
//         if (temaParaEditar) {
//             obtenerDatosTema();
//         }
//     }, [temaParaEditar]);

//     const obtenerDatosTema = () => {
//         setTitulo(temaParaEditar.titulo);
//         setObjetivos(temaParaEditar.objetivos);
//         setDescripcion(temaParaEditar.descripcion);
//         setRecursos(temaParaEditar.recursos);
//         setEstado(temaParaEditar.estado);
//     };

//     const handleTituloChange = (content) => setTitulo(content);
//     const handleObjetivosChange = (value) => setObjetivos(value);
//     const handleDescripcionChange = (value) => setDescripcion(value);
//     const handleRecursosChange = (value) => setRecursos(value);

//     const toolbarOptions = [
//         [{ header: "1" }, { header: "2" }],
//         ["bold", "italic", "underline", "strike", "blockquote"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link"],
//     ];

//     const cleanEmptyParagraphs = (content) => content.replace(/<p><br><\/p>/g, "");

//     const isQuillContentAvailable = (content) => content.replace(/<[^>]+>/g, "").trim().length > 0;

//     const cleanHtmlTags = (htmlContent) => {
//         const doc = new DOMParser().parseFromString(htmlContent, "text/html");
//         return doc.body.textContent || "";
//     };

//     const validarLongitudTitulo = (titulo) => {
//         const tituloLimpio = cleanHtmlTags(titulo).trim();
//         return tituloLimpio.length <= 255;
//     };

//     const tituloExistente = (nuevoTitulo) => {
//         const tituloLimpio = cleanHtmlTags(nuevoTitulo).trim().toLowerCase();
//         return temas?.some((tema) =>
//             tema.idTema !== temaParaEditar.idTema &&
//             cleanHtmlTags(tema.titulo).trim().toLowerCase() === tituloLimpio
//         );
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (
//             !isQuillContentAvailable(titulo) ||
//             !isQuillContentAvailable(objetivos) ||
//             !isQuillContentAvailable(descripcion) ||
//             !isQuillContentAvailable(recursos)
//         ) {
//             setSnackbarMessage("Por favor completa todos los campos.");
//             setSnackbarColor("error");
//             return;
//         }

//         if (!validarLongitudTitulo(titulo)) {
//             setSnackbarMessage("El título no puede exceder los 255 caracteres.");
//             setSnackbarColor("error");
//             return;
//         }

//         if (tituloExistente(titulo)) {
//             setSnackbarMessage("Ya existe un tema con este título.");
//             setSnackbarColor("error");
//             return;
//         }

//         try {
//             const datosFormulario = {
//                 id: temaParaEditar.idTema,
//                 titulo: DOMPurify.sanitize(titulo),
//                 objetivos: DOMPurify.sanitize(objetivos),
//                 descripcion: DOMPurify.sanitize(descripcion),
//                 recursos: DOMPurify.sanitize(recursos),
//                 estado: estado,
//             };

//             const response = await axios.post(
//                 `http://localhost:5000/temas/editarTema`,
//                 datosFormulario,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         version: "1.0.0",
//                     },
//                 }
//             );

//             const { temaEditadoBackend } = response.data;
//             if (response.data.en === 1) {
//                 let temaActualizado = { ...temaParaEditar };
//                 temaActualizado.idTema = temaEditadoBackend.id;
//                 temaActualizado.titulo = temaEditadoBackend.titulo;
//                 temaActualizado.objetivos = temaEditadoBackend.objetivos;
//                 temaActualizado.descripcion = temaEditadoBackend.descripcion;
//                 temaActualizado.recursos = temaEditadoBackend.recursos;
//                 temaActualizado.estado = temaEditadoBackend.estado;
//                 setTemaSeleccionado(temaActualizado);

//                 const mensaje = `${usuarioDetalles.detallesPersona.nombres} editó el tema con el título: "${cleanHtmlTags(titulo)}"`;

//                 await axios.post(`http://localhost:5000/historial/registrarCambio`, {
//                     tipoEntidad: "tema",
//                     idTema: temaParaEditar.idTema,
//                     detalles: mensaje,
//                     idUsuario: usuarioDetalles.id,
//                 });

//                 cargarTemasGestionar();
//                 setSnackbarMessage("Tema editado con éxito.");
//                 setSnackbarColor("success");
//                 handleClose();
//             } else {
//                 setSnackbarMessage("No se pudo editar el tema.");
//                 setSnackbarColor("error");
//             }
//         } catch (error) {
//             console.error("Error al editar el tema:", error);
//             setSnackbarMessage("Error al editar el tema.");
//             setSnackbarColor("error");
//         }
//     };

//     const handleClose = () => setOpen(false);
//     const handleOpen = () => setOpen(true);

//     return (
//         <>
//             <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleOpen}
//                 disabled={!temaParaEditar}
//                 size="small"
//             >
//                 Editar
//             </Button>
//             <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
//                 <DialogTitle>Edita el tema seleccionado</DialogTitle>
//                 <DialogContent>
//                     <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                             <form ref={formRef} onSubmit={handleSubmit}>
//                                 <div>
//                                     <Typography variant="body1" gutterBottom>Título (campo obligatorio):</Typography>
//                                     <ReactQuill
//                                         value={titulo}
//                                         onChange={handleTituloChange}
//                                         modules={{ toolbar: toolbarOptions }}
//                                     />
//                                 </div>
//                                 <div>
//                                     <Typography variant="body1" gutterBottom>Objetivos de aprendizaje (campo obligatorio):</Typography>
//                                     <ReactQuill
//                                         value={objetivos}
//                                         onChange={handleObjetivosChange}
//                                         modules={{ toolbar: toolbarOptions }}
//                                     />
//                                 </div>
//                                 <div>
//                                     <Typography variant="body1" gutterBottom>Descripción (campo obligatorio):</Typography>
//                                     <ReactQuill
//                                         value={descripcion}
//                                         onChange={handleDescripcionChange}
//                                         modules={{ toolbar: toolbarOptions }}
//                                     />
//                                 </div>
//                                 <div>
//                                     <Typography variant="body1" gutterBottom>Recursos adicionales (campo obligatorio):</Typography>
//                                     <ReactQuill
//                                         value={recursos}
//                                         onChange={handleRecursosChange}
//                                         modules={{ toolbar: toolbarOptions }}
//                                     />
//                                 </div>
//                             </form>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <Typography variant="h6" gutterBottom>Previsualizar</Typography>
//                             <JustifiedContent>
//                                 <PreviewSection>
//                                     <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(titulo) }} />
//                                 </PreviewSection>
//                                 <PreviewSection>
//                                     <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(objetivos) }} />
//                                 </PreviewSection>
//                                 {/* <PreviewSection> */}
//                                     <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(descripcion) }} />
//                                 {/* </PreviewSection> */}
//                                 <PreviewSection>
//                                     <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanEmptyParagraphs(recursos) }} />
//                                 </PreviewSection>
//                             </JustifiedContent>
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="secondary">
//                         Cancelar
//                     </Button>
//                     <Button onClick={handleSubmit} color="success">
//                         Guardar
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             <Snackbar
//                 open={!!snackbarMessage}
//                 autoHideDuration={2000}
//                 onClose={() => setSnackbarMessage("")}
//                 message={snackbarMessage}
//                 ContentProps={{
//                     style: {
//                         backgroundColor: snackbarColor === "success" ? "#4caf50" : "#f44336",
//                     },
//                 }}
//             />
//         </>
//     );
// }