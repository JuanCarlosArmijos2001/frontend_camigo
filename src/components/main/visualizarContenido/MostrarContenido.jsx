import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Button, Radio, RadioGroup, FormControlLabel, FormControl, Snackbar, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/system';
import MuiAlert from '@mui/material/Alert';
import { useTemaSeleccionado } from '../../../context/TemaSeleccionadoContext';
import { useSubtemaSeleccionado } from '../../../context/SubtemaSeleccionadoContext';
import { useEjercicioSeleccionado } from '../../../context/EjercicioSeleccionadoContext';
import { usePreguntaSeleccionado } from '../../../context/PreguntaSeleccionadoContext';
import { useSesionUsuario } from '../../../context/SesionUsuarioContext';
import EditorCompilador from './EditorCompilador';
import Editor from "@monaco-editor/react";
import ComentariosForm from '../comentarios/ComentariosForm';
import ResumenProgresoUsuarios from './ResumenProgresoUsuarios';
import axios from 'axios';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const MostrarContenido = ({ setProgresoUsuario }) => {
    const { temaSeleccionado, setTemaSeleccionado } = useTemaSeleccionado();
    const { subtemaSeleccionado, setSubtemaSeleccionado } = useSubtemaSeleccionado();
    const { ejercicioSeleccionado, setEjercicioSeleccionado } = useEjercicioSeleccionado();
    const { preguntaSeleccionado, setPreguntaSeleccionado } = usePreguntaSeleccionado();
    const { usuarioDetalles, setUsuarioDetalles } = useSesionUsuario();
    const [mostrarSolucion, setMostrarSolucion] = useState(false);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
    const [mostrarRetroalimentacion, setMostrarRetroalimentacion] = useState(false);
    const [correcto, setCorrecto] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [liked, setLiked] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const HOST = import.meta.env.VITE_HOST;

    useEffect(() => {
        setOpcionSeleccionada('');
        setMostrarRetroalimentacion(false);
        setCorrecto(null);
    }, [preguntaSeleccionado]);

    useEffect(() => {
        if (temaSeleccionado?.progreso === 100 ||
            subtemaSeleccionado?.progreso === 100 ||
            ejercicioSeleccionado?.progreso === 100 ||
            preguntaSeleccionado?.estado_completado === 1) {
            setOpenSnackbar(true);
        }
    }, [temaSeleccionado, subtemaSeleccionado, ejercicioSeleccionado, preguntaSeleccionado]);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (usuarioDetalles.id && temaSeleccionado?.idTema) {
                try {
                    const response = await axios.post(`${HOST}/valoracion/valoracionStatus`, {
                        idUsuario: usuarioDetalles.id,
                        idTema: temaSeleccionado.idTema
                    });
                    setLiked(response.data.valoracion === 1);
                } catch (error) {
                    console.error("Error fetching like status:", error);
                }
            }
        };
        fetchLikeStatus();
    }, [temaSeleccionado, usuarioDetalles.id]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleLike = async () => {
        try {
            const response = await axios.post(`${HOST}/valoracion/valoracionTemas`, {
                idUsuario: usuarioDetalles.id,
                idTema: temaSeleccionado.idTema
            });
            if (response.data.en === 1) {
                setLiked(!liked);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };


    const titleStyle = {
        color: '#3864A6',
        textAlign: 'center',
        marginBottom: '20px',
        '& > *': {
            color: 'inherit',
            textAlign: 'inherit',
        },
    };

    const sectionStyle = {
        marginBottom: '20px',
        textAlign: 'left',
    };

    const contentStyle = {
        '& > *': {
            textAlign: 'left',
        },
    };

    const renderContent = (content) => (
        <Box sx={contentStyle}>
            <CompactPreview>
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
            </CompactPreview>
        </Box>
    );


    const renderTema = () => (
        <>
            <Box sx={titleStyle}>
                {renderContent(temaSeleccionado.titulo)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Objetivos</Typography>
                {renderContent(temaSeleccionado.objetivos)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Descripción</Typography>
                {renderContent(temaSeleccionado.descripcion)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Recursos</Typography>
                {renderContent(temaSeleccionado.recursos)}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: '#3864A6',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 1
                    }}
                >
                    ¿Te gusta el tema? Dale like para posicionarlo como uno de los temas destacados.
                </Typography>
                <IconButton
                    onClick={handleLike}
                    sx={{
                        color: liked ? '#3864A6' : 'grey',
                        width: 60,
                        height: 60,
                        '& .MuiSvgIcon-root': {
                            fontSize: 40
                        }
                    }}
                >
                    <ThumbUpAltIcon />
                </IconButton>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    ¡Felicidades! Has completado este tema con éxito. Puedes revisarlo para reforzar tus conocimientos.
                </Alert>
            </Snackbar>
        </>
    );

    const renderSubtema = () => (
        <>
            <Box sx={titleStyle}>
                {renderContent(subtemaSeleccionado.titulo)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Objetivos</Typography>
                {renderContent(subtemaSeleccionado.objetivos)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Descripción</Typography>
                {renderContent(subtemaSeleccionado.descripcion)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Ejemplo de Código</Typography>
                <Editor height="300px" defaultLanguage="c" value={subtemaSeleccionado.ejemploCodigo} options={{ readOnly: true }} />
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Recursos</Typography>
                {renderContent(subtemaSeleccionado.recursos)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Retroalimentación</Typography>
                {renderContent(subtemaSeleccionado.retroalimentacion)}
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    ¡Felicidades! Haz completado este subtema con éxito. Puedes revisarlo para reforzar tus conocimientos.
                </Alert>
            </Snackbar>
        </>
    );

    const renderEjercicio = () => (
        <>
            <Box sx={titleStyle}>
                {renderContent(ejercicioSeleccionado.titulo)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Instrucciones</Typography>
                {renderContent(ejercicioSeleccionado.instrucciones)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Restricciones</Typography>
                {renderContent(ejercicioSeleccionado.restricciones)}
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Realiza tu solución:</Typography>
                <EditorCompilador />
            </Box>
            <Box sx={{
                ...sectionStyle,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#3864A6',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#2a4d7d'
                        }
                    }}
                    onClick={() => setMostrarSolucion(!mostrarSolucion)}
                >
                    {mostrarSolucion ? 'Ocultar solución' : 'Mostrar solución'}
                </Button>
            </Box>
            {mostrarSolucion && (
                <>
                    <Box sx={sectionStyle}>
                        <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Solución en Código</Typography>
                        <Editor height="300px" defaultLanguage="c" value={ejercicioSeleccionado.solucion} options={{ readOnly: true }} />
                    </Box>
                    <Box sx={sectionStyle}>
                        <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Retroalimentación</Typography>
                        {renderContent(ejercicioSeleccionado.retroalimentacion)}
                    </Box>
                </>
            )}
            <Box sx={sectionStyle}>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Comentarios</Typography>
                <ComentariosForm />
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    ¡Felicidades! Haz completado este ejercicio con éxito. Puedes revisarlo para reforzar tus conocimientos.
                </Alert>
            </Snackbar>
        </>
    );

    const aumentarProgreso = async (opcion) => {
        console.log("Opción seleccionada:", opcion);
        setOpcionSeleccionada(opcion);

        const isOptionCorrect = opcion === preguntaSeleccionado.respuesta_correcta;
        setCorrecto(isOptionCorrect);
        setMostrarRetroalimentacion(true);
        console.log("Respuesta correcta: ", preguntaSeleccionado.respuesta_correcta);

        if (isOptionCorrect) {
            setFeedbackMessage('¡Respuesta correcta! Bien hecho.');
            try {
                const response = await axios.post(`${HOST}/preguntas/completarPregunta`, {
                    idPregunta: preguntaSeleccionado.idPregunta,
                    idEjercicio: ejercicioSeleccionado.idEjercicio,
                    idSubtema: subtemaSeleccionado.idSubtema,
                    idTema: temaSeleccionado.idTema,
                    idUsuario: usuarioDetalles.id,
                });
                console.log(response.data);
                const { progresoUsuario, progresoTema, progresoSubtema, progresoEjercicio } = response.data;
                if (response.data.en === 1) {
                    setProgresoUsuario(progresoUsuario);
                    setTemaSeleccionado(prevState => ({ ...prevState, progreso: progresoTema }));
                    setSubtemaSeleccionado(prevState => ({ ...prevState, progreso: progresoSubtema }));
                    setEjercicioSeleccionado(prevState => ({ ...prevState, progreso: progresoEjercicio }));
                    setPreguntaSeleccionado(prevState => ({ ...prevState, estado_completado: 1 }));
                } else {
                    console.log("Hubo un problema al completar la pregunta");
                }
            } catch (error) {
                console.error("Error al completar la pregunta:", error);
            }
        } else {
            setFeedbackMessage('Respuesta incorrecta. Inténtalo de nuevo.');
            console.log("Intento fallido");
        }
    };

    const renderPregunta = () => {
        const opciones = ['a', 'b', 'c', 'd'];
    
        if (preguntaSeleccionado.estado_completado === 1) {
            return (
                <>
                    <Box sx={titleStyle}>
                        {renderContent(preguntaSeleccionado.enunciado)}
                    </Box>
                    <Box sx={sectionStyle}>
                        <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Respuesta seleccionada</Typography>
                        {renderContent(preguntaSeleccionado[`opcion_${preguntaSeleccionado.respuesta_correcta}`])}
                    </Box>
                    <Box sx={sectionStyle}>
                        <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold' }}>Justificación</Typography>
                        {renderContent(preguntaSeleccionado.justificacion)}
                    </Box>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            ¡Felicidades! Has completado esta pregunta con éxito. Puedes revisarla para reforzar tus conocimientos.
                        </Alert>
                    </Snackbar>
                </>
            );
        }
    
        return (
            <>
                <Box sx={titleStyle}>
                    {renderContent(preguntaSeleccionado.enunciado)}
                </Box>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold', textAlign: 'left' }}>
                    Selecciona la respuesta correcta:
                </Typography>
    
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                        aria-label="pregunta"
                        name="pregunta-opciones"
                        value={opcionSeleccionada}
                        onChange={(event) => aumentarProgreso(event.target.value)}
                    >
                        {opciones.map((opcion) => (
                            <FormControlLabel
                                key={opcion}
                                value={opcion}
                                control={<Radio />}
                                label={renderContent(preguntaSeleccionado[`opcion_${opcion}`])}
                                sx={{
                                    margin: '8px 0',
                                    alignItems: 'center',
                                    '& .MuiFormControlLabel-label': {
                                        width: '100%',
                                        paddingTop: '2px',
                                        fontFamily: 'inherit'
                                    },
                                    '& .MuiRadio-root': {
                                        padding: '8px',
                                        marginRight: '8px'
                                    }
                                }}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                {feedbackMessage && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" sx={{ color: 'RED', fontWeight: 'bold', textAlign: 'center' }}>
                            Respuesta incorrecta, inténtalo de nuevo.
                        </Typography>
                    </Box>
                )}
            </>
        );
    };


    const mensajeInicio = () => {
        return (
            <>
                <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold', textAlign: 'justify' }}>
                    ¡Bienvenido a C'amigo, tu aliado perfecto para aprender C!
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'justify' }}>
                    En "C'amigo", te ofrecemos una herramienta sencilla para fortalecer tu comprensión de la programación en C.
                    Aquí encontrarás <strong>temas</strong>, <strong>subtemas</strong>, <strong>ejercicios</strong> y <strong>preguntas de control </strong>
                    que te ayudarán a repasar lo visto en clase o a adelantarte en tu aprendizaje.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'justify' }}>
                    📚 <strong>Temas</strong>: La base de tu aprendizaje
                    <ul>
                        <li>🏷️ Título</li>
                        <li>🎯 Objetivos de aprendizaje</li>
                        <li>📝 Descripción</li>
                        <li>🔗 Recursos adicionales</li>
                    </ul>
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'justify' }}>
                    📖 <strong>Subtemas</strong>: Profundiza en cada concepto
                    <ul>
                        <li>🏷️ Título</li>
                        <li>🎯 Objetivos de aprendizaje</li>
                        <li>📝 Descripción</li>
                        <li>💻 Ejemplo de código</li>
                        <li>🔗 Recursos adicionales</li>
                        <li>💬 Retroalimentación</li>
                    </ul>
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'justify' }}>
                    🏋️ <strong>Ejercicios</strong>: Pon en práctica lo aprendido
                    <ul>
                        <li>🏷️ Título</li>
                        <li>📋 Instrucciones</li>
                        <li>⚠️ Restricciones</li>
                        <li>🧩 Solución en código</li>
                        <li>💬 Retroalimentación</li>
                    </ul>
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'justify' }}>
                    🧠 <strong>Preguntas de control</strong>: Evalúa tu comprensión
                    <ul>
                        <li>❓ Enunciado</li>
                        <li>🅰️ Primera opción</li>
                        <li>🅱️ Segunda opción</li>
                        <li>🅲️ Tercera opción</li>
                        <li>🅳️ Cuarta opción</li>
                        <li>✅ Respuesta correcta</li>
                        <li>💡 Justificación</li>
                    </ul>
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, mb: 4, textAlign: 'justify' }}>
                    <strong>¿Estás listo para mejorar tus habilidades en C?</strong> Navega por los contenidos, explora nuevos desafíos, y prepárate para dominar
                    el lenguaje de programación que marcará tu camino como desarrollador. ¡Vamos, tu éxito en C está a un clic de distancia!
                </Typography>

                {(usuarioDetalles.detallesRol.tipo === "docente" || usuarioDetalles.detallesRol.tipo === "administrador") && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ color: '#3864A6', fontWeight: 'bold', textAlign: 'justify' }}>
                            Progreso de los estudiantes en C'amigo
                        </Typography>
                        <Typography variant="body1" sx={{ textAlign: 'justify', mb: 3 }}>
                            A continuación, encontrará una tabla que resume el progreso de los estudiantes en C'amigo. Esta tabla muestra el avance general de cada estudiante, incluyendo un promedio de su progreso en todos los temas, subtemas y ejercicios. Esta sección le permitirá monitorear el uso del software por parte de los estudiantes y su evolución en el aprendizaje de C.
                        </Typography>
                        <ResumenProgresoUsuarios />
                    </Box>
                )}
            </>
        );
    };

    const renderContenido = () => {
        if (preguntaSeleccionado) {
            return renderPregunta();
        } else if (ejercicioSeleccionado) {
            return renderEjercicio();
        } else if (subtemaSeleccionado) {
            return renderSubtema();
        } else if (temaSeleccionado) {
            return renderTema();
        } else {
            return mensajeInicio();
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
                {renderContenido()}
            </Box>
        </Paper>
    );
};

export default MostrarContenido;
