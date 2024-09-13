import React from "react";
import { Grid, Box, Container, Typography } from "@mui/material";
import GestionarTemas from "../temas/GestionarTemas";
import GestionarSubtemas from "../subtemas/GestionarSubtemas";
import GestionarEjercicio from "../ejercicios/GestionarEjercicios";
import GestionarPregunta from "../preguntas/GestionarPreguntas";
import CardSeleccionarTema from "../../utilities/CardSeleccionarTema";
import CardSeleccionarSubtema from "../../utilities/CardSeleccionarSubtema";
import CardSeleccionarEjercicio from "../../utilities/CardSeleccionarEjercicio";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";

export default function GestionarContenido({ cargarTemasGeneral }) {
    const { temaSeleccionado } = useTemaSeleccionado();
    const { subtemaSeleccionado } = useSubtemaSeleccionado();
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();

    const sectionStyle = {
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'auto',
    };

    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            <Grid container spacing={2}>
                {/* Fila Superior */}
                <Grid item xs={12} md={6}>
                    <Box sx={sectionStyle}>
                        <GestionarTemas cargarTemasGeneral={cargarTemasGeneral} />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={sectionStyle}>
                        {temaSeleccionado ? (
                            <GestionarSubtemas />
                        ) : (
                            <CardSeleccionarTema />
                        )}
                    </Box>
                </Grid>

                {/* Fila Inferior */}
                <Grid item xs={12} md={6}>
                    <Box sx={sectionStyle}>
                        {subtemaSeleccionado ? (
                            <GestionarEjercicio />
                        ) : (
                            <CardSeleccionarSubtema />
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={sectionStyle}>
                        {ejercicioSeleccionado ? (
                            <GestionarPregunta />
                        ) : (
                            <CardSeleccionarEjercicio />
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}