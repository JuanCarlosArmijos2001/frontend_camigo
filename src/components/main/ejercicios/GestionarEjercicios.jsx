import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Grid, Button, TextField, Card, CardContent, CardMedia, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody,
    TableCell, TableHead, TableRow, Icon
} from "@mui/material";
import Imagen from "../../../assets/images/crear.svg";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import ModalRegistrarEjercicio from "./ModalRegistrarEjercicio";
import ModalEditarEjercicio from "./ModalEditarEjercicio";
import AddIcon from '@mui/icons-material/Add';

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
            .post(`http://localhost:5000/ejercicios/listarEjercicios`, parametros)
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
                .post(`http://localhost:5000/historial/listarCambios`, {
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

    const activarDesactivarEjercicio = () => {
        if (ejercicioSeleccionado) {
            const nuevoEstado = ejercicioSeleccionado.estado === 1 ? -1 : 1;

            axios
                .post(`http://localhost:5000/ejercicios/activarDesactivarEjercicio`, {
                    id: ejercicioSeleccionado.idEjercicio,
                    estado: nuevoEstado,
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        cargarEjercicios();
                    }
                })
                .catch((error) => {
                    console.error("Error al cambiar el estado del ejercicio:", error);
                });
        }
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
                        <Typography variant="body2">Los ejercicios con fondo color rojo están desactivados</Typography>
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
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="error"
                                disabled={!ejercicioSeleccionado}
                                onClick={activarDesactivarEjercicio}
                                size="small"
                            >
                                {ejercicioSeleccionado?.estado === 1 ? "Desactivar" : "Activar"}
                            </Button>
                        </Grid>
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
