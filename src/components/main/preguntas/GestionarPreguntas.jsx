import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Grid, Button, TextField, Card, CardContent, CardMedia, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody,
    TableCell, TableHead, TableRow, Icon
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import ModalRegistrarPregunta from "./ModalRegistrarPregunta";
import ModalEditarPregunta from "./ModalEditarPregunta";
import Imagen from "../../../assets/images/crear.svg";

const GestionarPreguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();
    const { preguntaSeleccionado, actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
    const [term, setTerm] = useState("");
    const [existePreguntas, setExistePreguntas] = useState(false);
    const [historialCambios, setHistorialCambios] = useState([]);
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const { usuarioDetalles } = useSesionUsuario();

    useEffect(() => {
        if (ejercicioSeleccionado) {
            cargarPreguntas();
        }
    }, [ejercicioSeleccionado]);

    const cargarPreguntas = () => {
        axios.post(`http://localhost:5000/preguntas/listarPreguntas`, {
            idEjercicio: ejercicioSeleccionado.idEjercicio,
            idUsuario: usuarioDetalles.id,
            mensaje: "preguntas",
        })
        .then((response) => {
            if (response.data.en === 1) {
                setPreguntas(response.data.preguntas);
                setExistePreguntas(true);
            } else {
                console.log("Hubo un problema al cargar las preguntas");
                setExistePreguntas(false);
            }
        })
        .catch((error) => {
            console.error("Error al obtener las preguntas:", error);
        });
    };

    const activarDesactivarPregunta = () => {
        if (preguntaSeleccionado) {
            const nuevoEstado = preguntaSeleccionado.estado === 1 ? -1 : 1;
            axios.post(`http://localhost:5000/preguntas/activarDesactivarPregunta`, {
                id: preguntaSeleccionado.idPregunta,
                estado: nuevoEstado,
            })
            .then((response) => {
                if (response.data.en === 1) {
                    cargarPreguntas();
                    registrarCambioHistorial(nuevoEstado);
                } else {
                    console.log("No se pudo cambiar el estado de la pregunta");
                }
            })
            .catch((error) => {
                console.error("Error al cambiar el estado de la pregunta:", error);
            });
        }
    };

    const registrarCambioHistorial = (nuevoEstado) => {
        const usuarioId = usuarioDetalles.id;
        const estadoMensaje = nuevoEstado === 1 ? "activo" : "inactivo";
        axios.post(`http://localhost:5000/historial/registrarCambio`, {
            tipoEntidad: "pregunta",
            idPregunta: preguntaSeleccionado.idPregunta,
            detalles: `${usuarioDetalles.detallesPersona.nombres} cambió el estado de la pregunta "${cleanHtmlTags(preguntaSeleccionado.enunciado)}" a ${estadoMensaje}`,
            idUsuario: usuarioId,
        })
        .then((historialResponse) => {
            if (historialResponse.data.en === 1) {
                console.log("Cambio registrado en el historial");
            } else {
                console.log("No se pudo registrar el cambio en el historial");
            }
        })
        .catch((error) => {
            console.error("Error al registrar el cambio en el historial:", error);
        });
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const filteredPreguntas = term
        ? preguntas.filter((pregunta) =>
            pregunta.enunciado && cleanHtmlTags(pregunta.enunciado).toLowerCase().includes(term.toLowerCase())
        )
        : preguntas;

    const cargarHistorialCambios = () => {
        if (preguntaSeleccionado) {
            axios.post(`http://localhost:5000/historial/listarCambios`, {
                idEntidad: preguntaSeleccionado.idPregunta,
                tipoEntidad: "pregunta",
            })
            .then((response) => {
                if (response.data.en === 1) {
                    setHistorialCambios(response.data.cambios);
                    setShowHistorialModal(true);
                } else {
                    console.log("No se encontraron cambios para esta pregunta");
                }
            })
            .catch((error) => {
                console.error("Error al obtener el historial de cambios:", error);
            });
        }
    };

    return (
        <Grid container spacing={2}>
            {existePreguntas ? (
                <>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">Preguntas de control</Typography>
                        <Typography variant="body2">Las preguntas con fondo color rojo están desactivadas</Typography>
                        <Typography variant="body2">Es necesario seleccionar una pregunta para editar o para cambiar su estado de activo a inactivo.</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar pregunta"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Table sx={{ border: '1px solid lightgray' }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#3864A6', color: 'white' }}>
                                    <TableCell sx={{ backgroundColor: '#3864A6', color: 'white', textAlign: 'center' }}>
                                        Preguntas de control existentes
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPreguntas.length > 0 ? (
                                    filteredPreguntas.map((pregunta, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => actualizarPreguntaSeleccionado(pregunta)}
                                            sx={{
                                                backgroundColor: pregunta.estado === -1 ? '#ffcccc' : preguntaSeleccionado?.idPregunta === pregunta.idPregunta ? 'lightgray' : 'transparent',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <TableCell>{cleanHtmlTags(pregunta.enunciado)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell>No se encontraron preguntas</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Grid>

                    <Grid item xs={12} container spacing={2} justifyContent="center">
                        <Grid item>
                            <ModalRegistrarPregunta
                                cargarPreguntas={cargarPreguntas}
                                preguntas={preguntas}
                            />
                        </Grid>
                        <Grid item>
                            <ModalEditarPregunta
                                cargarPreguntas={cargarPreguntas}
                                preguntaParaEditar={preguntaSeleccionado}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="error"
                                disabled={!preguntaSeleccionado}
                                onClick={activarDesactivarPregunta}
                                size="small"
                            >
                                {preguntaSeleccionado?.estado === 1 ? "Desactivar" : "Activar"}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="info"
                                onClick={cargarHistorialCambios}
                                disabled={!preguntaSeleccionado}
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
                                Sé pionero: Haz de este ejercicio un espacio lleno de preguntas de control interesantes.
                            </Typography>
                            <div style={{ marginTop: '16px' }}>
                                <ModalRegistrarPregunta
                                    cargarPreguntas={cargarPreguntas}
                                    preguntas={preguntas}
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

export default GestionarPreguntas;