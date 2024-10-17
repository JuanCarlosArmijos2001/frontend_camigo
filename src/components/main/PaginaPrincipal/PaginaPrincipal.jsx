import React, { useState } from 'react';
import { Grid, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavBar from './NavBar';
import VisualizarContenido from '../visualizarContenido/VisualizarContenido';
import GestionarContenido from '../gestionarContenido/GestionarContenido';
import Administracion from '../administracion/Administracion';
import ValoracionTemas from '../valoracion/ValoracionTemas';
import { useSesionUsuario } from '../../../context/SesionUsuarioContext';

function PaginaPrincipal() {
    const { usuarioDetalles } = useSesionUsuario();
    const tipoUsuario = usuarioDetalles?.detallesRol?.tipo || '';
    const [currentSection, setCurrentSection] = useState('valoracion-temas');

    const handleButtonClick = () => {
        if (tipoUsuario === 'estudiante') {
            setCurrentSection('visualizar-contenido');
        } else if (tipoUsuario === 'docente') {
            setCurrentSection(prevSection => 
                prevSection === 'gestionar-contenido' ? 'simular-contenido' : 'gestionar-contenido'
            );
        } else if (tipoUsuario === 'administrador') {
            setCurrentSection(prevSection => 
                prevSection === 'administracion' ? 'simular-contenido' : 'administracion'
            );
        }
    };

    const handleHomeClick = () => {
        setCurrentSection('valoracion-temas');
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        ...theme.applyStyles('dark', {
            backgroundColor: '#1A2027',
        }),
    }));

    // Nuevo componente styled para el NavBar
    const NavBarItem = styled(Paper)(({ theme }) => ({
        backgroundColor: '#3864A6',
        padding: 0,
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        borderRadius: '3px', // Bordes más redondeados
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada
        overflow: 'hidden', // Asegura que el contenido respete los bordes redondeados
    }));

    const renderContent = () => {
        switch (currentSection) {
            case 'gestionar-contenido':
                return <GestionarContenido />;
            case 'simular-contenido':
                return <VisualizarContenido />;
            case 'administracion':
                return <Administracion />;
            case 'visualizar-contenido':
                return <VisualizarContenido />;
            default:
                return <ValoracionTemas />;
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid item xs={12}>
                    <NavBarItem>
                        <NavBar
                            onButtonClick={handleButtonClick}
                            onHomeClick={handleHomeClick}
                            currentSection={currentSection}
                        />
                    </NavBarItem>
                    <Item>
                        {renderContent()}
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PaginaPrincipal;