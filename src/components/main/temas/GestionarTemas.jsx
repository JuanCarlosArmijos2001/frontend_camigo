import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Button, TextField, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableHead, TableRow, Icon } from "@mui/material";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import ModalRegistrarTema from "./ModalRegistrarTema";
import ModalEditarTema from "./ModalEditarTema";
import AddIcon from "@mui/icons-material/Add";
import ConfirmacionActivarDesactivarContenido from "../../utilities/ConfirmacionActivarDesactivarContenido";

const GestionarTemas = ({ cargarTemasGeneral }) => {
    const [temas, setTemas] = useState([]);
    const { temaSeleccionado, actualizarTemaSeleccionado } = useTemaSeleccionado();
    const { actualizarSubtemaSeleccionado } = useSubtemaSeleccionado();
    const { actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
    const { actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();
    const [term, setTerm] = useState('');
    const [historialCambios, setHistorialCambios] = useState([]);
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        cargarTemasGestionar();
    }, []);

    const cargarTemasGestionar = () => {
        const parametros = {
            idUsuario: usuarioDetalles.id,
            mensaje: "temas",
        };

        axios
            .post(`http://localhost:5000/temas/listarTemas`, parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    setTemas(response.data.temas);
                } else {
                    console.log("Hubo un problema al cargar los temas");
                }
            })
            .catch((error) => {
                console.error("Error al obtener los temas:", error);
            });
    };

    const cargarHistorialCambios = () => {
        if (temaSeleccionado) {
            axios
                .post(`http://localhost:5000/historial/listarCambios`, {
                    idEntidad: temaSeleccionado.idTema,
                    tipoEntidad: "tema",
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        setHistorialCambios(response.data.cambios);
                        setShowHistorialModal(true);
                    } else {
                        console.log("No se encontraron cambios para este tema");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener el historial de cambios:", error);
                });
        }
    };

    const handleActivarDesactivar = () => {
        if (temaSeleccionado) {
            setShowConfirmDialog(true);
        }
    };

    const activarDesactivarTema = () => {
        if (temaSeleccionado) {
            const nuevoEstado = temaSeleccionado.estado === 1 ? -1 : 1;
            const tituloLimpio = removeHtmlTags(temaSeleccionado.titulo);
            const accion = nuevoEstado === 1 ? 'activó' : 'desactivó';
    
            const mensaje = `${usuarioDetalles.detallesPersona.nombres} ${accion} el tema con el título: "${tituloLimpio}"`;
    
            axios
                .post(`http://localhost:5000/temas/activarDesactivarTema`, {
                    id: temaSeleccionado.idTema,
                    estado: nuevoEstado,
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        // Registrar el cambio en el historial con el mensaje detallado
                        registrarCambioHistorial(temaSeleccionado.idTema, mensaje);
                        
                        // Actualizar la lista de temas después del cambio
                        cargarTemasGestionar();
                        
                        // Si cargarTemasGeneral es una función proporcionada como prop, llamarla
                        if (typeof cargarTemasGeneral === 'function') {
                            cargarTemasGeneral();
                        }
                        
                        // Actualizar el tema seleccionado con el nuevo estado
                        actualizarTemaSeleccionado({...temaSeleccionado, estado: nuevoEstado});
                        
                        console.log(mensaje);
                    } else {
                        console.log("Hubo un problema al cambiar el estado del tema:", response.data.m);
                    }
                })
                .catch((error) => {
                    console.error("Error al cambiar el estado del tema:", error);
                });
        }
    };

    const registrarCambioHistorial = (idTema, detalles) => {
        axios
            .post(`http://localhost:5000/historial/registrarCambio`, {
                tipoEntidad: "tema",
                idTema: idTema,
                idSubtema: null,
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

    const filteredTemas = term
        ? temas.filter(tema =>
            removeHtmlTags(tema.titulo).toLowerCase().includes(term.toLowerCase())
        )
        : temas;

    return (
        <Grid container spacing={2}>
            {temas.length > 0 ? (
                <>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">Temas</Typography>
                        <Typography variant="body2">Los temas con fondo color rojo están desactivados.</Typography>
                        <Typography variant="body2">Es necesario seleccionar un tema para editar o para cambiar su estado de activo a inactivo.</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar tema"
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
                                        Temas existentes
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTemas.length > 0 ? (
                                    filteredTemas.map((tema, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => {
                                                actualizarTemaSeleccionado(tema);
                                                actualizarSubtemaSeleccionado(null);
                                                actualizarEjercicioSeleccionado(null);
                                                actualizarPreguntaSeleccionado(null);
                                            }}
                                            style={{
                                                backgroundColor: tema.estado === -1 ? '#ffcccc' : temaSeleccionado?.idTema === tema.idTema ? 'lightgray' : 'transparent',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <TableCell>{removeHtmlTags(tema.titulo)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={1}>No se encontraron temas</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Grid>

                    <Grid item xs={12} container spacing={2} justifyContent="center">
                        <Grid item>
                            <ModalRegistrarTema
                                cargarTemasGestionar={cargarTemasGestionar}
                                cargarTemasGeneral={cargarTemasGeneral}
                                temas={temas}
                            />
                        </Grid>
                        <Grid item>
                            <ModalEditarTema
                                cargarTemasGestionar={cargarTemasGestionar}
                                cargarTemasGeneral={cargarTemasGeneral}
                                temaParaEditar={temaSeleccionado}
                                temas={temas}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="error"
                                disabled={!temaSeleccionado}
                                onClick={handleActivarDesactivar}
                                size="small"
                            >
                                {temaSeleccionado?.estado === 1 ? "Desactivar" : "Activar"}
                            </Button>
                        </Grid>
                        <ConfirmacionActivarDesactivarContenido
                            open={showConfirmDialog}
                            onClose={() => setShowConfirmDialog(false)}
                            onConfirm={() => {
                                activarDesactivarTema();
                                setShowConfirmDialog(false);
                            }}
                            itemSeleccionado={temaSeleccionado}
                            tipoItem="tema"
                        />
                        <Grid item>
                            <Button
                                variant="contained"
                                color="info"
                                onClick={cargarHistorialCambios}
                                disabled={!temaSeleccionado}
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
                                Da el primer paso: ¡Crea el primer tema!
                            </Typography>
                            <div style={{ marginTop: '16px' }}>
                                <ModalRegistrarTema
                                    cargarTemasGestionar={cargarTemasGestionar}
                                    cargarTemasGeneral={cargarTemasGeneral}
                                    temas={temas}
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

export default GestionarTemas;
