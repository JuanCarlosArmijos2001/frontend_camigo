import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, IconButton, Grid } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import { useSesionUsuario } from '../../../context/SesionUsuarioContext';
import { useSesionKeycloak } from '../../../context/SesionKeycloakContext';
import logo from '../../../assets/images/logo Camigo.jpeg';
import { useTemaSeleccionado } from '../../../context/TemaSeleccionadoContext';
import { useSubtemaSeleccionado } from '../../../context/SubtemaSeleccionadoContext';
import { useEjercicioSeleccionado } from '../../../context/EjercicioSeleccionadoContext';
import { usePreguntaSeleccionado } from '../../../context/PreguntaSeleccionadoContext';
import ModalEditarUsuario from '../../administrarSesion/ModalEditarUsuario';
import axios from 'axios';

function NavBar({ onButtonClick, onHomeClick, currentSection }) {
    const { usuarioDetalles, cerrarSesion } = useSesionUsuario();
    const nombreUsuario = usuarioDetalles?.detallesPersona?.nombres || 'Usuario';
    const tipoUsuario = usuarioDetalles?.detallesRol?.tipo || '';
    const { setTemaSeleccionado } = useTemaSeleccionado();
    const { setSubtemaSeleccionado } = useSubtemaSeleccionado();
    const { setEjercicioSeleccionado } = useEjercicioSeleccionado();
    const { setPreguntaSeleccionado } = usePreguntaSeleccionado();
    const [modalEditarUsuarioAbierto, setModalEditarUsuarioAbierto] = useState(false);
    const [periodoActual, setPeriodoActual] = useState(null);
    const { usuarioDetallesKeycloak, cerrarSesionKeycloak, isAuthenticated } = useSesionKeycloak();
    const isKeycloakUser = isAuthenticated && usuarioDetallesKeycloak;

    useEffect(() => {
        obtenerPeriodoActual();
    }, []);

    const getButtonText = () => {
        if (tipoUsuario === 'estudiante') return "Visualizar Contenido";
        if (tipoUsuario === 'docente') return currentSection === 'gestionar-contenido' ? "Simular Contenido" : "Gestionar Contenido";
        if (tipoUsuario === 'administrador') return currentSection === 'administracion' ? "Simular Contenido" : "Administración";
        return "";
    };

    const getButtonColor = () => {
        switch (tipoUsuario) {
            case 'docente': return 'primary';
            case 'administrador': return 'info';
            case 'estudiante': return 'secondary';
            default: return 'primary';
        }
    };

    const cerrarSesionFormateo = () => {
        setTemaSeleccionado(null);
        setSubtemaSeleccionado(null);
        setEjercicioSeleccionado(null);
        setPreguntaSeleccionado(null);

        if (isKeycloakUser) {
            cerrarSesionKeycloak();
        } else {
            cerrarSesion();
        }
        // cerrarSesion();
    };

    const abrirModalEditarUsuario = () => {
        setModalEditarUsuarioAbierto(true);
    };

    const cerrarModalEditarUsuario = () => {
        setModalEditarUsuarioAbierto(false);
    };

    const obtenerPeriodoActual = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/periodoAcademico/periodoAcademicoActual`);
            setPeriodoActual(response.data.periodoActual);
        } catch (error) {
            console.error('Error al obtener el periodo académico actual:', error);
            setPeriodoActual({ error: true });
        }
    };

    const renderPeriodoActual = () => {
        if (!periodoActual) {
            return "Cargando periodo...";
        }
        if (periodoActual.error) {
            return "Error al cargar el periodo";
        }
        return `${periodoActual.mesInicio} - ${periodoActual.mesFin}`;
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#3864A6' }}>
                <Toolbar>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={6} lg={8} sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                onClick={onHomeClick}
                                aria-label="ir a inicio"
                                sx={{
                                    width: 70,
                                    height: 70,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                <img
                                    src={logo}
                                    alt="Inicio"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </IconButton>
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'white',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontWeight: 700,
                                        fontSize: {
                                            xs: '1rem',
                                            sm: '1.25rem',
                                            md: '1.5rem',
                                            lg: '1.75rem'
                                        },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    Bienvenido, {nombreUsuario}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: 'white',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: {
                                            xs: '0.7rem',
                                            sm: '0.8rem',
                                            md: '0.9rem',
                                            lg: '1rem'
                                        },
                                        opacity: 0.8,
                                    }}
                                >
                                    Periodo académico: {renderPeriodoActual()}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box display="flex" justifyContent="flex-end" flexWrap="nowrap" gap={1}>
                                <Button
                                    color={getButtonColor()}
                                    variant="contained"
                                    onClick={onButtonClick}
                                    sx={{
                                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                                        padding: { xs: '6px 10px', sm: '6px 16px' },
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {getButtonText()}
                                </Button>
                                <Button
                                    startIcon={<EditIcon />}
                                    onClick={abrirModalEditarUsuario}
                                    variant="contained"
                                    color="success"
                                    sx={{
                                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                                        padding: { xs: '6px 10px', sm: '6px 16px' },
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Editar
                                </Button>
                                <Button
                                    startIcon={<LogoutIcon />}
                                    onClick={cerrarSesionFormateo}
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                                        padding: { xs: '6px 10px', sm: '6px 16px' },
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Salir
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <ModalEditarUsuario
                open={modalEditarUsuarioAbierto}
                onClose={cerrarModalEditarUsuario}
            />
        </Box>
    );
}

export default NavBar;
