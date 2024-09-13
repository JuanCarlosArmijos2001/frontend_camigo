import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSesionUsuario } from '../../../context/SesionUsuarioContext';

function NavBar({ onButtonClick, onHomeClick, currentSection }) {
    const { usuarioDetalles, cerrarSesion } = useSesionUsuario();
    const nombreUsuario = usuarioDetalles?.detallesPersona?.nombres || 'Usuario';
    const tipoUsuario = usuarioDetalles?.detallesRol?.tipo || '';

    const getButtonText = () => {
        if (tipoUsuario === 'estudiante') {
            return "Visualizar Contenido";
        }
        if (tipoUsuario === 'docente') {
            return currentSection === 'gestionar-contenido' ? "Simular Contenido" : "Gestionar Contenido";
        }
        if (tipoUsuario === 'administrador') {
            return currentSection === 'administracion' ? "Simular Contenido" : "Administración";
        }
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

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Box display="flex" alignItems="center">
                        <IconButton 
                            onClick={onHomeClick} 
                            color="primary" 
                            aria-label="ir a inicio"
                            sx={{
                                width: 56,
                                height: 56,
                                '&:hover': {
                                    backgroundColor: 'rgba(56, 100, 166, 0.04)',
                                },
                            }}
                        >
                            <HomeIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                        <Typography variant="h3" sx={{ color: '#3864A6', ml: 2 }}>
                            Bienvenido, {nombreUsuario}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        {(tipoUsuario === 'docente' || tipoUsuario === 'administrador' || tipoUsuario === 'estudiante') && (
                            <Button
                                color={getButtonColor()}
                                variant="contained"
                                onClick={onButtonClick}
                                sx={{
                                    mr: 1,
                                    backgroundColor: (theme) => theme.palette[getButtonColor()].main
                                }}
                            >
                                {getButtonText()}
                            </Button>
                        )}
                        <IconButton
                            onClick={cerrarSesion}
                            color="primary"
                            aria-label="cerrar sesión"
                            sx={{
                                ml: 1,
                                width: 48,
                                height: 48,
                                '&:hover': {
                                    backgroundColor: 'rgba(56, 100, 166, 0.04)',
                                },
                            }}
                        >
                            <LogoutIcon sx={{ fontSize: 24 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;