import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Grid, Button, TextField, Card, CardContent, CardMedia, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody,
    TableCell, TableHead, TableRow, Icon
} from "@mui/material";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import ModalRegistrarEjercicio from "./ModalRegistrarEjercicio";
import ModalEditarEjercicio from "./ModalEditarEjercicio";
import AddIcon from '@mui/icons-material/Add';
import ConfirmacionActivarDesactivarContenido from "../../utilities/ConfirmacionActivarDesactivarContenido";

const GestionarEjercicios = () => {
    const [ejercicios, setEjercicios] = useState([]);
    const { subtemaSeleccionado } = useSubtemaSeleccionado();
    const { ejercicioSeleccionado, actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
    const { actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();
    const [term, setTerm] = useState('');
    const [existeEjercicios, setExisteEjercicios] = useState(false);
    const [historialCambios, setHistorialCambios] = useState([]);
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const HOST = import.meta.env.VITE_HOST;

    useEffect(() => {
        if (subtemaSeleccionado) {
            cargarEjercicios();
        }
    }, [subtemaSeleccionado]);

    const cargarEjercicios = () => {
        if (!subtemaSeleccionado) return;

        const parametros = {
            idSubtema: subtemaSeleccionado.idSubtema,
            idUsuario: usuarioDetalles.id,
            mensaje: "ejercicios",
        };

        axios
            .post(`${HOST}/ejercicios/listarEjercicios`, parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    setEjercicios(response.data.ejercicios);
                    setExisteEjercicios(true);
                } else {
                    console.log("Hubo un problema al cargar los ejercicios");
                    setExisteEjercicios(false);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los ejercicios:", error);
            });
    };

    const cargarHistorialCambios = () => {
        if (ejercicioSeleccionado) {
            axios
                .post(`${HOST}/historial/listarCambios`, {
                    idEntidad: ejercicioSeleccionado.idEjercicio,
                    tipoEntidad: "ejercicio",
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        setHistorialCambios(response.data.cambios);
                        setShowHistorialModal(true);
                    } else {
                        console.log("No se encontraron cambios para este ejercicio");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener el historial de cambios:", error);
                });
        }
    };

    const handleActivarDesactivar = () => {
        if (ejercicioSeleccionado) {
            setShowConfirmDialog(true);
        }
    };

    // const activarDesactivarEjercicio = () => {
    //     if (ejercicioSeleccionado) {
    //         const nuevoEstado = ejercicioSeleccionado.estado === 1 ? -1 : 1;

    //         axios
    //             .post(`${HOST}/ejercicios/activarDesactivarEjercicio`, {
    //                 id: ejercicioSeleccionado.idEjercicio,
    //                 estado: nuevoEstado,
    //             })
    //             .then((response) => {
    //                 if (response.data.en === 1) {
    //                     cargarEjercicios();
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error("Error al cambiar el estado del ejercicio:", error);
    //             });
    //     }
    // };

    const activarDesactivarEjercicio = () => {
        if (ejercicioSeleccionado) {
            const nuevoEstado = ejercicioSeleccionado.estado === 1 ? -1 : 1;
            const tituloLimpio = removeHtmlTags(ejercicioSeleccionado.titulo);
            const accion = nuevoEstado === 1 ? 'activó' : 'desactivó';
    
            const mensaje = `${usuarioDetalles.detallesPersona.nombres} ${accion} el ejercicio con el título: "${tituloLimpio}"`;
    
            axios
                .post(`${HOST}/ejercicios/activarDesactivarEjercicio`, {
                    id: ejercicioSeleccionado.idEjercicio,
                    estado: nuevoEstado,
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        // Registrar el cambio en el historial con el mensaje detallado
                        registrarCambioHistorial(ejercicioSeleccionado.idEjercicio, mensaje);
                        
                        // Actualizar la lista de ejercicios después del cambio
                        cargarEjercicios();
                        
                        // Actualizar el ejercicio seleccionado con el nuevo estado
                        actualizarEjercicioSeleccionado({...ejercicioSeleccionado, estado: nuevoEstado});
                        
                        console.log(mensaje);
                    } else {
                        console.log("Hubo un problema al cambiar el estado del ejercicio:", response.data.m);
                    }
                })
                .catch((error) => {
                    console.error("Error al cambiar el estado del ejercicio:", error);
                });
        }
    };

    const registrarCambioHistorial = (idEjercicio, detalles) => {
        axios
            .post(`${HOST}/historial/registrarCambio`, {
                tipoEntidad: "ejercicio",
                idTema: null,
                idSubtema: subtemaSeleccionado.idSubtema,
                idEjercicio: idEjercicio,
                idPregunta: null,
                detalles: detalles,
                idUsuario: usuarioDetalles.id
            })
            .then((response) => {
                if (response.data.en === 1) {
                    console.log("Cambio registrado en el historial:", response.data.m);
                    // Actualizar el estado local del historial
                    setHistorialCambios(prevHistorial => [...prevHistorial, {
                        fecha: new Date(),
                        detalles: detalles
                    }]);
                } else {
                    console.error("Error al registrar el cambio en el historial:", response.data.m);
                }
            })
            .catch((error) => {
                console.error("Error al registrar el cambio en el historial:", error);
            });
    };

    const removeHtmlTags = (text) => {
        if (!text) return '';
        return text.replace(/<\/?[^>]+(>|$)/g, "");
    };

    const filteredEjercicios = term
        ? ejercicios.filter(ejercicio =>
            removeHtmlTags(ejercicio.titulo).toLowerCase().includes(term.toLowerCase())
        )
        : ejercicios;

    return (
        <Grid container spacing={2}>
            {existeEjercicios ? (
                <>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">Ejercicios</Typography>
                        <Typography variant="body2">Los ejercicios con fondo color rojo están desactivados.</Typography>
                        <Typography variant="body2">Es necesario seleccionar un ejercicio para editar o para cambiar su estado de activo a inactivo.</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar ejercicio"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Table sx={{ border: '1px solid lightgray' }}>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        backgroundColor: '#3864A6',
                                        color: 'white',
                                        textAlign: 'center'
                                    }}
                                >
                                    <TableCell
                                        style={{
                                            backgroundColor: '#3864A6',
                                            color: 'white',
                                            textAlign: 'center'
                                        }}
                                    >
                                        Ejercicios existentes
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEjercicios.length > 0 ? (
                                    filteredEjercicios.map((ejercicio, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => {
                                                actualizarEjercicioSeleccionado(ejercicio);
                                                actualizarPreguntaSeleccionado(null);
                                            }}
                                            style={{
                                                backgroundColor: ejercicio.estado === -1 ? '#ffcccc' : ejercicioSeleccionado?.idEjercicio === ejercicio.idEjercicio ? 'lightgray' : 'transparent',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <TableCell>{removeHtmlTags(ejercicio.titulo)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={1}>No se encontraron ejercicios</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Grid>

                    <Grid item xs={12} container spacing={2} justifyContent="center">
                        <Grid item>
                            <ModalRegistrarEjercicio
                                cargarEjercicios={cargarEjercicios}
                                ejercicios={ejercicios}
                            />
                        </Grid>
                        <Grid item>
                            <ModalEditarEjercicio
                                cargarEjercicios={cargarEjercicios}
                                ejercicioParaEditar={ejercicioSeleccionado}
                                ejercicios={ejercicios}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="error"
                                disabled={!ejercicioSeleccionado}
                                onClick={handleActivarDesactivar}
                                size="small"
                            >
                                {ejercicioSeleccionado?.estado === 1 ? "Desactivar" : "Activar"}
                            </Button>
                        </Grid>
                        <ConfirmacionActivarDesactivarContenido
                            open={showConfirmDialog}
                            onClose={() => setShowConfirmDialog(false)}
                            onConfirm={() => {
                                activarDesactivarEjercicio();
                                setShowConfirmDialog(false);
                            }}
                            itemSeleccionado={ejercicioSeleccionado}
                            tipoItem="ejercicio"
                        />
                        <Grid item>
                            <Button
                                variant="contained"
                                color="info"
                                onClick={cargarHistorialCambios}
                                disabled={!ejercicioSeleccionado}
                                size="small"
                            >
                                Historial
                            </Button>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%', maxWidth: '1000px', height: 'auto' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Icon
                                component={AddIcon}
                                sx={{ fontSize: 100, color: 'primary.main', marginBottom: 2 }}
                            />
                            <Typography variant="h5" gutterBottom>
                                Da el primer paso: ¡Crea el primer ejercicio!
                            </Typography>
                            <div style={{ marginTop: '16px' }}>
                                <ModalRegistrarEjercicio
                                    cargarEjercicios={cargarEjercicios}
                                    ejercicios={ejercicios}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            )}

            {/* Modal para el Historial de Cambios */}
            <Dialog open={showHistorialModal} onClose={() => setShowHistorialModal(false)}>
                <DialogTitle>Historial de Cambios</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Detalles</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historialCambios.map((cambio, index) => (
                                <TableRow key={index}>
                                    <TableCell>{new Date(cambio.fecha).toLocaleString()}</TableCell>
                                    <TableCell>{cambio.detalles}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowHistorialModal(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default GestionarEjercicios;
