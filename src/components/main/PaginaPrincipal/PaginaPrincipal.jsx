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
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: 'pink', padding: '5px' }}>
            <Grid container style={{ backgroundColor: 'blue', padding: '5px' }}>
                <Grid item xs={12} style={{ backgroundColor: 'yellow', padding: '5px' }}>
                    <Item style={{ backgroundColor: 'red' }}>
                        <NavBar
                            onButtonClick={handleButtonClick}
                            onHomeClick={handleHomeClick}
                            currentSection={currentSection}
                        />
                    </Item>
                    <Item style={{ backgroundColor: 'green' }}>
                        {renderContent()}
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PaginaPrincipal;