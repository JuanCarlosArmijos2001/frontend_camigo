import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CardRegistroExitosoEstudiante from '../utilities/CardRegistroExitosoEstudiante';
import IniciarSesion from './IniciarSesion';
import LogoCamigoCarrera from '../../assets/images/logoCamigoCarrera.svg';

function RegistrarEstudiante() {
    const [usuario, setUsuario] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        clave: '',
        tipoRol: 'estudiante',
        externalId: uuidv4(),
    });

    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [error, setError] = useState(null);
    const [mostrarIniciarSesion, setMostrarIniciarSesion] = useState(false);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLimpiarCampos = () => {
        setUsuario({
            nombres: '',
            apellidos: '',
            email: '',
            clave: '',
            tipoRol: 'estudiante',
            externalId: uuidv4(),
        });
    };

    const handleMostrarIniciarSesion = () => {
        setMostrarIniciarSesion(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const emptyFields = Object.values(usuario).some((field) => field.trim() === '');
        if (emptyFields) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        const regexNombres = /^\S+(\s\S+){1}$/;
        if (!regexNombres.test(usuario.nombres.trim())) {
            setError('Por favor, ingrese sus dos nombres.');
            return;
        }

        const regexApellidos = /^\S+(\s\S+){1}$/;
        if (!regexApellidos.test(usuario.apellidos.trim())) {
            setError('Por favor, ingrese sus dos apellidos.');
            return;
        }

        if (!validateEmail(usuario.email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }


        try {
            const usuarioConExternalId = { ...usuario, external_id: usuario.externalId };
            const response = await axios.post(
                `http://localhost:5000/sesionUsuario/registro`,
                usuarioConExternalId,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        version: '1.0.0',
                    },
                }
            );

            const { en, m } = response.data;

            if (en === 1) {
                console.log('Registro exitoso:', m);
                setRegistroExitoso(true);
                handleLimpiarCampos();
            } else {
                console.error('Error en el registro:', m);
            }
        } catch (error) {
            console.error('Error al enviar los datos al backend:', error);
        }
    };

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            {!mostrarIniciarSesion ? (
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: `url(${LogoCamigoCarrera})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            // backgroundSize: 'cover',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <AccountCircleIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Registro
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                {error && (
                                    <Typography variant="body1" color="error" align="center">
                                        {error}
                                    </Typography>
                                )}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="nombres"
                                    label="Ingrese sus dos nombres"
                                    name="nombres"
                                    autoComplete="nombres"
                                    autoFocus
                                    value={usuario.nombres}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="apellidos"
                                    label="Ingrese sus dos apellidos"
                                    name="apellidos"
                                    autoComplete="apellidos"
                                    value={usuario.apellidos}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Ingrese su correo electrónico"
                                    name="email"
                                    autoComplete="email"
                                    value={usuario.email}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="clave"
                                    label="Ingrese su contraseña"
                                    type="password"
                                    id="clave"
                                    autoComplete="current-password"
                                    value={usuario.clave}
                                    onChange={handleChange}
                                />
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    Registrarse
                                </Button>

                                <Grid container>
                                    <Grid item>
                                        <Link variant="body2" onClick={handleMostrarIniciarSesion}>
                                            {registroExitoso
                                                ? "Tu cuenta ha sido creada. Inicia sesión."
                                                : "¿Ya tienes una cuenta? Inicia sesión."}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    {registroExitoso && <CardRegistroExitosoEstudiante />}
                </Grid>
            ) : (
                <IniciarSesion />
            )}
        </ThemeProvider>
    );
}

export default RegistrarEstudiante;
