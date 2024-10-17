import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ListarContenido from './ListarContenido';
import MostrarContenido from './MostrarContenido';
import { useSesionUsuario } from '../../../context/SesionUsuarioContext';
import axios from 'axios';

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

const obtenerProgresoUsuario = (usuarioDetalles, setProgresoUsuario) => {
    const parametros = {
        idUsuario: usuarioDetalles.id
    };

    axios.post(`http://localhost:5000/usuario/progresoUsuario`, parametros)
        .then((response) => {
            if (response.data.en === 1) {
                setProgresoUsuario(response.data.progreso);
                console.log("Progreso del usuario:", response.data.progreso);
            } else {
                console.log("No se encontró el progreso del usuario");
            }
        })
        .catch((error) => {
            console.error("Error al obtener el progreso del usuario:", error);
        });
};

function VisualizarContenido() {
    const { usuarioDetalles } = useSesionUsuario();
    const [progresoUsuario, setProgresoUsuario] = useState(-1);
    console.log("PROGRESO EN PADRE", progresoUsuario);
    const tipoUsuario = usuarioDetalles?.detallesRol?.tipo || '';

    useEffect(() => {
        obtenerProgresoUsuario(usuarioDetalles, setProgresoUsuario);
    }, [usuarioDetalles]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>                
                {tipoUsuario === 'docente' || tipoUsuario === 'administrador' ? (
                    <Grid item xs={12}>
                        <Typography
                            variant="h4"
                            align="left"
                            gutterBottom
                            sx={{
                                color: '#3864A6',
                                fontWeight: 'bold',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            Simular contenido
                        </Typography>
                    </Grid>
                ) : null}

                <Grid item xs={12} sm={3.6}>
                    <Item>
                        <ListarContenido progresoUsuario={progresoUsuario} />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={8.4}>
                    <Item>
                        <MostrarContenido setProgresoUsuario={setProgresoUsuario} />
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}

export default VisualizarContenido;