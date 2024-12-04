import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Grid, Button, TextField, Card, CardContent, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody,
    TableCell, TableHead, TableRow, Icon
} from "@mui/material";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import ModalRegistrarSubtema from "./ModalRegistrarSubtema";
import ModalEditarSubtema from "./ModalEditarSubtema";
import AddIcon from "@mui/icons-material/Add";
import ConfirmacionActivarDesactivarContenido from "../../utilities/ConfirmacionActivarDesactivarContenido";

const GestionarSubtemas = ({ cargarSubtemasGeneral }) => {
    const [subtemas, setSubtemas] = useState([]);
    const { temaSeleccionado } = useTemaSeleccionado();
    const { subtemaSeleccionado, actualizarSubtemaSeleccionado } = useSubtemaSeleccionado();
    const { actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
    const { actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();
    const [term, setTerm] = useState('');
    const [existeSubtemas, setExisteSubtemas] = useState(false);
    const [historialCambios, setHistorialCambios] = useState([]);
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const HOST = import.meta.env.VITE_HOST;

    useEffect(() => {
        if (temaSeleccionado) {
            cargarSubtemas();
        }
    }, [temaSeleccionado]);

    const cargarSubtemas = () => {
        if (!temaSeleccionado) return;

        const parametros = {
            idTema: temaSeleccionado.idTema,
            idUsuario: usuarioDetalles.id,
            mensaje: "subtemas",
        };

        axios
            .post(`${HOST}/subtemas/listarSubtemas`, parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    setSubtemas(response.data.subtemas);
                    setExisteSubtemas(true);
                } else {
                    console.log("Hubo un problema al cargar los subtemas");
                    setExisteSubtemas(false);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los subtemas:", error);
            });
    };

    const cargarHistorialCambios = () => {
        if (subtemaSeleccionado) {
            axios
                .post(`${HOST}/historial/listarCambios`, {
                    idEntidad: subtemaSeleccionado.idSubtema,
                    tipoEntidad: "subtema",
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        setHistorialCambios(response.data.cambios);
                        setShowHistorialModal(true);
                    } else {
                        console.log("No se encontraron cambios para este subtema");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener el historial de cambios:", error);
                });
        }
    };

    const handleActivarDesactivar = () => {
        if (subtemaSeleccionado) {
            setShowConfirmDialog(true);
        }
    };

    // const activarDesactivarSubtema = () => {
    //     if (subtemaSeleccionado) {
    //         const nuevoEstado = subtemaSeleccionado.estado === 1 ? -1 : 1;

    //         axios
    //             .post(`${HOST}/subtemas/activarDesactivarSubtema`, {
    //                 id: subtemaSeleccionado.idSubtema,
    //                 estado: nuevoEstado,
    //             })
    //             .then((response) => {
    //                 if (response.data.en === 1) {
    //                     cargarSubtemas();
    //                     if (cargarSubtemasGeneral) cargarSubtemasGeneral();
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error("Error al cambiar el estado del subtema:", error);
    //             });
    //     }
    // };

    const activarDesactivarSubtema = () => {
        if (subtemaSeleccionado) {
            const nuevoEstado = subtemaSeleccionado.estado === 1 ? -1 : 1;
            const tituloLimpio = removeHtmlTags(subtemaSeleccionado.titulo);
            const accion = nuevoEstado === 1 ? 'activó' : 'desactivó';
    
            const mensaje = `${usuarioDetalles.detallesPersona.nombres} ${accion} el subtema con el título: "${tituloLimpio}"`;
    
            axios
                .post(`${HOST}/subtemas/activarDesactivarSubtema`, {
                    id: subtemaSeleccionado.idSubtema,
                    estado: nuevoEstado,
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        // Registrar el cambio en el historial con el mensaje detallado
                        registrarCambioHistorial(subtemaSeleccionado.idSubtema, mensaje);
                        
                        // Actualizar la lista de subtemas después del cambio
                        cargarSubtemas();
                        
                        // Si cargarSubtemasGeneral es una función proporcionada como prop, llamarla
                        if (typeof cargarSubtemasGeneral === 'function') {
                            cargarSubtemasGeneral();
                        }
                        
                        // Actualizar el subtema seleccionado con el nuevo estado
                        actualizarSubtemaSeleccionado({...subtemaSeleccionado, estado: nuevoEstado});
                        
                        console.log(mensaje);
                    } else {
                        console.log("Hubo un problema al cambiar el estado del subtema:", response.data.m);
                    }
                })
                .catch((error) => {
                    console.error("Error al cambiar el estado del subtema:", error);
                });
        }
    };

    const registrarCambioHistorial = (idSubtema, detalles) => {
        axios
            .post(`${HOST}/historial/registrarCambio`, {
                tipoEntidad: "subtema",
                idTema: temaSeleccionado.idTema,
                idSubtema: idSubtema,
                idEjercicio: null,
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

    const filteredSubtemas = term
        ? subtemas.filter(subtema =>
            removeHtmlTags(subtema.titulo).toLowerCase().includes(term.toLowerCase())
        )
        : subtemas;

    return (
        <Grid container spacing={2}>
            {existeSubtemas ? (
                <>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">Subtemas</Typography>
                        <Typography variant="body2">Los subtemas con fondo color rojo están desactivados.</Typography>
                        <Typography variant="body2">Es necesario seleccionar un subtema para editar o para cambiar su estado de activo a inactivo.</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar subtema"
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
                                        Subtemas existentes
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSubtemas.length > 0 ? (
                                    filteredSubtemas.map((subtema, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => {
                                                actualizarSubtemaSeleccionado(subtema);
                                                actualizarEjercicioSeleccionado(null);
                                                actualizarPreguntaSeleccionado(null);
                                            }}
                                            style={{
                                                backgroundColor: subtema.estado === -1 ? '#ffcccc' : subtemaSeleccionado?.idSubtema === subtema.idSubtema ? 'lightgray' : 'transparent',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <TableCell>{removeHtmlTags(subtema.titulo)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={1}>No se encontraron subtemas</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Grid>

                    <Grid item xs={12} container spacing={2} justifyContent="center">
                        <Grid item>
                            <ModalRegistrarSubtema
                                cargarSubtemas={cargarSubtemas}
                                cargarSubtemasGeneral={cargarSubtemasGeneral}
                                subtemas={subtemas}
                            />
                        </Grid>
                        <Grid item>
                            <ModalEditarSubtema
                                cargarSubtemas={cargarSubtemas}
                                subtemaParaEditar={subtemaSeleccionado}
                                subtemas={subtemas}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="error"
                                disabled={!subtemaSeleccionado}
                                onClick={handleActivarDesactivar}
                                size="small"
                            >
                                {subtemaSeleccionado?.estado === 1 ? "Desactivar" : "Activar"}
                            </Button>
                        </Grid>
                        <ConfirmacionActivarDesactivarContenido
                            open={showConfirmDialog}
                            onClose={() => setShowConfirmDialog(false)}
                            onConfirm={() => {
                                activarDesactivarSubtema();
                                setShowConfirmDialog(false);
                            }}
                            itemSeleccionado={subtemaSeleccionado}
                            tipoItem="subtema"
                        />
                        <Grid item>
                            <Button
                                variant="contained"
                                color="info"
                                onClick={cargarHistorialCambios}
                                disabled={!subtemaSeleccionado}
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
                                Da el primer paso: ¡Crea el primer subtema!
                            </Typography>
                            <div style={{ marginTop: '16px' }}>
                                <ModalRegistrarSubtema
                                    cargarSubtemas={cargarSubtemas}
                                    subtemas={subtemas}
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

export default GestionarSubtemas;