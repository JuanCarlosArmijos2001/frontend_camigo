import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box, Button, Paper, LinearProgress, TextField } from '@mui/material';
import { useTemaSeleccionado } from '../../../context/TemaSeleccionadoContext';
import { useSubtemaSeleccionado } from '../../../context/SubtemaSeleccionadoContext';
import { useEjercicioSeleccionado } from '../../../context/EjercicioSeleccionadoContext';
import { usePreguntaSeleccionado } from '../../../context/PreguntaSeleccionadoContext';
import { useSesionUsuario } from '../../../context/SesionUsuarioContext';
import LogoCamigo from '../../../assets/images/logoCamigoCarrera.svg';

const ListarContenido = ({ progresoUsuario }) => {
    const [temas, setTemas] = useState([]);
    const [subtemas, setSubtemas] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);
    const [preguntas, setPreguntas] = useState([]);
    const [currentLevel, setCurrentLevel] = useState('temas');
    const [validarContenidoPrincipal, setValidarContenidoPrincipal] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { usuarioDetalles } = useSesionUsuario();
    const { temaSeleccionado, setTemaSeleccionado } = useTemaSeleccionado();
    const { subtemaSeleccionado, setSubtemaSeleccionado } = useSubtemaSeleccionado();
    const { ejercicioSeleccionado, setEjercicioSeleccionado } = useEjercicioSeleccionado();
    const { preguntaSeleccionado, setPreguntaSeleccionado } = usePreguntaSeleccionado();

    useEffect(() => {
        // console.log("====================================");
        // console.log("Useffect de ListarContenido");
        if (usuarioDetalles && validarContenidoPrincipal) {
            cargarTemas();
            setValidarContenidoPrincipal(false);
            // console.log("Se cargaron los temas");
        } else if (preguntaSeleccionado) {
            cargarPreguntas(ejercicioSeleccionado);
            // console.log("Se cargaron las preguntas");
        }
    }, [usuarioDetalles, preguntaSeleccionado]);

    // console.log("PROGRESO", progresoUsuario);

    const cargarTemas = () => {
        const parametros = {
            idUsuario: usuarioDetalles.id,
            mensaje: "temas",
        };

        axios.post(`http://localhost:5000/temas/listarTemas`, parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    const temasActivos = response.data.temas.filter(tema => tema.estado === 1);
                    setTemas(temasActivos);
                } else {
                    console.log("Hubo un problema al cargar los temas");
                }
            })
            .catch((error) => {
                console.error("Error al obtener los temas:", error);
            });
    };

    const cargarSubtemas = (tema) => {
        const parametros = {
            idTema: tema.idTema,
            idUsuario: usuarioDetalles.id,
            mensaje: "subtemas",
        };

        axios.post(`http://localhost:5000/subtemas/listarSubtemas`, parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    const subtemasActivos = response.data.subtemas.filter(subtema => subtema.estado === 1);
                    setSubtemas(subtemasActivos);
                    setCurrentLevel('subtemas');
                } else {
                    console.log("Hubo un problema al cargar los subtemas");
                    setSubtemas([]);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los subtemas:", error);
            });
    };

    const cargarEjercicios = (subtema) => {
        const parametros = {
            idSubtema: subtema.idSubtema,
            idUsuario: usuarioDetalles.id,
            mensaje: "ejercicios",
        };

        axios.post(`http://localhost:5000/ejercicios/listarEjercicios`, parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    const ejerciciosActivos = response.data.ejercicios.filter(ejercicio => ejercicio.estado === 1);
                    setEjercicios(ejerciciosActivos);
                    setCurrentLevel('ejercicios');
                } else {
                    console.log("Hubo un problema al cargar los ejercicios");
                    setEjercicios([]);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los ejercicios:", error);
            });
    };

    const cargarPreguntas = (ejercicio) => {
        axios.post(`http://localhost:5000/preguntas/listarPreguntas`, {
            idEjercicio: ejercicio.idEjercicio,
            idUsuario: usuarioDetalles.id,
            mensaje: "preguntas",
        })
            .then((response) => {
                if (response.data.en === 1) {
                    const preguntasActivas = response.data.preguntas.filter(pregunta => pregunta.estado === 1);
                    setPreguntas(preguntasActivas);
                    setCurrentLevel('preguntas');
                } else {
                    console.log("Hubo un problema al cargar las preguntas");
                    setPreguntas([]);
                }
            })
            .catch((error) => {
                console.error("Error al obtener las preguntas:", error);
            });
    };

    const handleItemClick = (item) => {
        switch (currentLevel) {
            case 'temas':
                setTemaSeleccionado(item);
                cargarSubtemas(item);
                break;
            case 'subtemas':
                setSubtemaSeleccionado(item);
                cargarEjercicios(item);
                break;
            case 'ejercicios':
                setEjercicioSeleccionado(item);
                cargarPreguntas(item);
                break;
            case 'preguntas':
                setPreguntaSeleccionado(item);
                break;
            default:
                break;
        }
    };

    const handleBack = () => {
        switch (currentLevel) {
            case 'subtemas':
                setCurrentLevel('temas');
                setSubtemaSeleccionado(null);
                cargarTemas();
                break;
            case 'ejercicios':
                setCurrentLevel('subtemas');
                setEjercicioSeleccionado(null);
                cargarSubtemas(temaSeleccionado);
                break;
            case 'preguntas':
                setCurrentLevel('ejercicios');
                setPreguntaSeleccionado(null);
                cargarEjercicios(subtemaSeleccionado);
                break;
            default:
                break;
        }
        setSearchTerm('');
    };

    const stripHtml = (html) => {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const filterItems = (items) => {
        return items.filter(item =>
            stripHtml(item.titulo || item.enunciado).toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const renderList = () => {
        let items = [];
        let title = '';

        switch (currentLevel) {
            case 'temas':
                items = filterItems(temas);
                title = 'Temas';
                break;
            case 'subtemas':
                items = filterItems(subtemas);
                title = 'Subtemas';
                break;
            case 'ejercicios':
                items = filterItems(ejercicios);
                title = 'Ejercicios';
                break;
            case 'preguntas':
                items = filterItems(preguntas);
                title = 'Preguntas';
                break;
            default:
                break;
        }

        return (
            <>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        color: '#3864A6',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        mb: 2
                    }}
                >
                    {title}
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Buscar ${title.toLowerCase()}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
                {items.length > 0 ? (
                    <List>
                        {items.map((item) => (
                            <ListItem
                                button
                                key={item.id || item.idTema || item.idSubtema || item.idEjercicio || item.idPregunta}
                                onClick={() => handleItemClick(item)}
                                sx={{
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={stripHtml(item.titulo || item.enunciado)}
                                    primaryTypographyProps={{ variant: 'subtitle1' }}
                                />
                                <Box sx={{ width: '100%', mt: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={currentLevel === 'preguntas' ? (item.estado_completado === 1 ? 100 : 0) : (item.progreso || 0)}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                backgroundColor: '#3864A6',
                                            },
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    Progreso: {currentLevel === 'preguntas' ? (item.estado_completado === 1 ? '100%' : '0%') : `${item.progreso || 0}%`}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 2,
                            textAlign: 'center',
                            color: '#3864A6',
                            fontFamily: 'Poppins, sans-serif',
                        }}
                    >
                        No se encontró ningún {title.toLowerCase().slice(0, -1)} que coincida con la búsqueda.
                    </Typography>
                )}
            </>
        );
    };

    const getBackButtonText = () => {
        switch (currentLevel) {
            case 'subtemas':
                return 'Volver a Temas';
            case 'ejercicios':
                return 'Volver a Subtemas';
            case 'preguntas':
                return 'Volver a Ejercicios';
            default:
                return 'Volver';
        }
    };

    return (
        <Paper elevation={3} sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Box sx={{
                width: '100%',
                backgroundColor: '#3864A6',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}>
                <img
                    src={LogoCamigo}
                    alt="C'amigo Logo"
                    style={{ width: '250px', height: '150px' }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        mt: 2,
                        color: 'white',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: {
                            xs: '1.10rem',
                            sm: '1.25rem',
                            md: '1.50rem'
                        }
                    }}
                >
                    C'amigo tu amigo ideal en C
                </Typography>
                <Box sx={{ width: '80%', maxWidth: '300px' }}>
                    <LinearProgress
                        variant="determinate"
                        value={progresoUsuario}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                backgroundColor: 'white',
                            },
                        }}
                    />
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        mt: 1,
                        color: 'white',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: {
                            xs: '0.60rem',
                            sm: '0.80rem',
                            md: '1.05rem'
                        }
                    }}
                >
                    Tu progreso en C'amigo es de: {progresoUsuario}%
                </Typography>
            </Box>

            <Box sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                overflow: 'auto'
            }}>
                {currentLevel !== 'temas' && (
                    <Button
                        onClick={handleBack}
                        sx={{ mb: 2, alignSelf: 'flex-start' }}
                        variant="outlined"
                    >
                        {getBackButtonText()}
                    </Button>
                )}
                {renderList()}
            </Box>
        </Paper>
    );
};

export default ListarContenido;