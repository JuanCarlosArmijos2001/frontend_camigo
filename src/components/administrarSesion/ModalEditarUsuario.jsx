import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import axios from "axios";

const ModalEditarUsuario = ({ open, onClose }) => {
    const { usuarioDetalles, setUsuarioDetalles } = useSesionUsuario();
    const [nuevosDatos, setNuevosDatos] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        claveActual: "",
        nuevaClave: "",
        confirmarClave: "",
    });

    const [claveValidada, setClaveValidada] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    useEffect(() => {
        if (usuarioDetalles) {
            setNuevosDatos({
                nombres: usuarioDetalles.detallesPersona.nombres,
                apellidos: usuarioDetalles.detallesPersona.apellidos,
                email: usuarioDetalles.detallesCuenta.email,
                claveActual: "",
                nuevaClave: "",
                confirmarClave: "",
            });
        }
    }, [open, usuarioDetalles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevosDatos((prevDatos) => ({ ...prevDatos, [name]: value }));
    };

    const showSnackbar = (message, severity = "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const validarClaveActual = async () => {
        try {
            const response = await axios.post(
                `http://localhost:5000/sesionUsuario/validarClave`,
                {
                    userId: usuarioDetalles.id,
                    claveActual: nuevosDatos.claveActual
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            const { en, m } = response.data;

            if (en === 1) {
                setClaveValidada(true);
                showSnackbar("Contraseña actual validada correctamente", "success");
            } else {
                setClaveValidada(false);
                showSnackbar(m || "La contraseña actual es incorrecta");
            }
        } catch (error) {
            console.error("Error al validar la contraseña:", error);
            showSnackbar("Error al conectar con el servidor");
            setClaveValidada(false);
        }
    };

    const validarCampos = () => {
        if (!claveValidada) {
            showSnackbar("Debes validar tu contraseña actual");
            return false;
        }
        if (nuevosDatos.nuevaClave && nuevosDatos.nuevaClave !== nuevosDatos.confirmarClave) {
            showSnackbar("Las nuevas claves no coinciden");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevosDatos.email)) {
            showSnackbar("El email no es válido");
            return false;
        }
        if (nuevosDatos.nombres.trim() === "" || nuevosDatos.apellidos.trim() === "") {
            showSnackbar("Los nombres y apellidos no pueden estar vacíos");
            return false;
        }
        return true;
    };

    const handleGuardarCambios = async () => {
        if (!validarCampos()) return;

        const datosActualizados = {
            userId: usuarioDetalles.id,
            nombres: nuevosDatos.nombres,
            apellidos: nuevosDatos.apellidos,
            email: nuevosDatos.email,
        };

        if (nuevosDatos.nuevaClave) {
            datosActualizados.clave = nuevosDatos.nuevaClave;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/sesionUsuario/editarUsuario`,
                datosActualizados,
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            const { en, m, usuarioEditado } = response.data;

            if (en === 1) {
                console.log("Usuario actualizado exitosamente", usuarioEditado);
                setUsuarioDetalles(prevDetalles => ({
                    ...prevDetalles,
                    detallesPersona: {
                        ...prevDetalles.detallesPersona,
                        nombres: usuarioEditado.nombres,
                        apellidos: usuarioEditado.apellidos,
                    },
                    detallesCuenta: {
                        ...prevDetalles.detallesCuenta,
                        email: usuarioEditado.email,
                    },
                }));
                showSnackbar("Usuario actualizado exitosamente", "success");
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                showSnackbar(m || "Error al actualizar el usuario");
            }
        } catch (error) {
            console.error("Error en la petición para actualizar el usuario:", error);
            if (error.response) {
                showSnackbar(`Error del servidor: ${error.response.data.m || error.response.statusText}`);
            } else if (error.request) {
                showSnackbar("No se recibió respuesta del servidor");
            } else {
                showSnackbar(`Error: ${error.message}`);
            }
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Usuario</DialogTitle>
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        textAlign: 'justify',
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                            width: '100%'
                        }
                    }}
                >
                    <Typography variant="body2">
                        Si ha iniciado sesión con credenciales del IAM de Computación,
                        le recomendamos modificar sus datos directamente en ese sistema
                        para evitar conflictos o discrepancias entre plataformas.
                    </Typography>
                </Alert>
                <DialogContent>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="nombres"
                            label="Nombres"
                            name="nombres"
                            autoComplete="given-name"
                            value={nuevosDatos.nombres}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="apellidos"
                            label="Apellidos"
                            name="apellidos"
                            autoComplete="family-name"
                            value={nuevosDatos.apellidos}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={nuevosDatos.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="claveActual"
                            label="Contraseña Actual"
                            type="password"
                            id="claveActual"
                            autoComplete="current-password"
                            value={nuevosDatos.claveActual}
                            onChange={handleChange}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                            <Button
                                onClick={validarClaveActual}
                                variant="contained"
                                color="primary"
                                disabled={!nuevosDatos.claveActual}
                            >
                                Validar Contraseña Actual
                            </Button>
                        </Box>
                        {claveValidada && (
                            <>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="nuevaClave"
                                    label="Nueva Contraseña (opcional)"
                                    type="password"
                                    id="nuevaClave"
                                    autoComplete="new-password"
                                    value={nuevosDatos.nuevaClave}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="confirmarClave"
                                    label="Confirmar Nueva Contraseña"
                                    type="password"
                                    id="confirmarClave"
                                    autoComplete="new-password"
                                    value={nuevosDatos.confirmarClave}
                                    onChange={handleChange}
                                />
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cerrar</Button>
                    <Button onClick={handleGuardarCambios} variant="contained" color="primary" disabled={!claveValidada}>
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ModalEditarUsuario;
