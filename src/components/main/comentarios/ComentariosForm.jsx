import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Alert,
    Container,
    Typography,
    Box,
    List,
    ListItem,
    IconButton
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import axios from 'axios';

const ComentariosForm = () => {
    const { token, usuarioDetalles } = useSesionUsuario();
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();

    const [contenido, setContenido] = useState("");
    const [error, setError] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [comentarioEditable, setComentarioEditable] = useState(null);
    const HOST = import.meta.env.VITE_HOST;

    useEffect(() => {
        if (ejercicioSeleccionado) {
            cargarComentarios();
        }
    }, [ejercicioSeleccionado]);

    const cargarComentarios = async () => {
        try {
            const response = await axios.post(`${HOST}/comentarios/listarComentarios`, {
                idEjercicio: ejercicioSeleccionado.idEjercicio,
            });
            if (response && response.data) {
                setComentarios(response.data.comentarios);
            }
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
        }
    };

    const limpiarFormulario = () => {
        setContenido("");
        setComentarioEditable(null);
    };

    const handleComentarioSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setError("Debes iniciar sesión para agregar un comentario.");
            return;
        }

        setError(null);

        if (contenido.trim() === "") {
            setError("Por favor, ingrese el contenido del comentario.");
            return;
        }

        try {
            if (comentarioEditable) {
                await axios.post(`${HOST}/comentarios/editarComentario`, {
                    id: comentarioEditable.id,
                    nombreUsuario: usuarioDetalles.detallesPersona.nombres,
                    contenido,
                });
            } else {
                await axios.post(`${HOST}/comentarios/registrarComentario`, {
                    idEjercicio: ejercicioSeleccionado.idEjercicio,
                    nombreUsuario: usuarioDetalles.detallesPersona.nombres,
                    contenido,
                });
            }
            limpiarFormulario();
            cargarComentarios();
        } catch (error) {
            console.error("Error al procesar el comentario:", error);
            setError("Hubo un error al procesar el comentario. Por favor, inténtelo de nuevo.");
        }
    };

    const handleEditarComentario = (comentario) => {
        setComentarioEditable(comentario);
        setContenido(comentario.contenido);
    };

    if (!ejercicioSeleccionado) {
        console.log("No hay ejercicio seleccionado");
        return null;
    }

    return (
        <Container maxWidth="md">
            <Box mb={2}>
                {token && (
                    <form onSubmit={handleComentarioSubmit}>
                        <Typography variant="body1" sx={{ color: '#3864A6', fontWeight: 'bold', textAlign: 'left' }}>
                            ¿Tienes dudas {usuarioDetalles.detallesPersona.nombres}?, coméntalas:
                        </Typography>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            fullWidth
                            multiline
                            rows={5}
                            variant="outlined"
                            placeholder={`Ingrese un nuevo comentario ${usuarioDetalles.detallesPersona.nombres}`}
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            sx={{ my: 2, width: '100%' }}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            {comentarioEditable ? "Editar Comentario" : "Agregar Comentario"}
                        </Button>
                    </form>
                )}
            </Box>
            <Box>
                <List>
                    {comentarios.map((comentario) => (
                        <ListItem
                            key={comentario.id}
                            alignItems="flex-start"
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                borderBottom: '1px solid #e0e0e0',
                                py: 2
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                                <Typography variant="subtitle1" component="div">
                                    {comentario.nombreUsuario}
                                </Typography>
                                {token && comentario.nombreUsuario === usuarioDetalles.detallesPersona.nombres && (
                                    <IconButton edge="end" onClick={() => handleEditarComentario(comentario)}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    width: '100%'
                                }}
                            >
                                {comentario.contenido}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default ComentariosForm;