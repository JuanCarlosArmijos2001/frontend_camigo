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
    // Verificación adicional antes de hacer la solicitud
    if (!usuarioDetalles || !usuarioDetalles.id) {
        console.error("Detalles de usuario no válidos");
        setProgresoUsuario(0);
        return;
    }

    const parametros = {
        idUsuario: usuarioDetalles.id
    };
    const HOST = import.meta.env.VITE_HOST;

    axios.post(`${HOST}/usuario/progresoUsuario`, parametros)
        .then((response) => {
            // Verificaciones más robustas de la respuesta
            if (response.data && response.data.en === 1 && response.data.progreso !== undefined) {
                // Asegurar que el progreso esté entre 0 y 100
                const progreso = Math.max(0, Math.min(100, response.data.progreso));
                setProgresoUsuario(progreso);
                // console.log("Progreso del usuario:", progreso);
            } else {
                console.warn("Respuesta inesperada al obtener progreso:", response.data);
                setProgresoUsuario(0);
            }
        })
        .catch((error) => {
            console.error("Error al obtener el progreso del usuario:", error);
            setProgresoUsuario(0);
        });
};

function VisualizarContenido() {
    const { usuarioDetalles } = useSesionUsuario();
    // Cambia el estado inicial a 0
    const [progresoUsuario, setProgresoUsuario] = useState(0);
    const tipoUsuario = usuarioDetalles?.detallesRol?.tipo || '';

    useEffect(() => {
        // Solo intentar obtener progreso si hay detalles de usuario
        if (usuarioDetalles && usuarioDetalles.id) {
            obtenerProgresoUsuario(usuarioDetalles, setProgresoUsuario);
        }
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