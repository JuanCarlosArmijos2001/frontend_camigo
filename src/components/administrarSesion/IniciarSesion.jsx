// import React, { useState, useEffect } from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import axios from 'axios';
// import { useSesionUsuario } from '../../context/SesionUsuarioContext';
// import { jwtDecode } from 'jwt-decode';
// import RegistrarEstudiante from './RegistrarEstudiante';
// import LogoCamigoCarrera from '../../assets/images/logoCamigoCarrera.svg';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';

// function Copyright(props) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//             {'Copyright ©'}
//             <Link color="inherit" href="https://www.unl.edu.ec/">
//                 Universidad Nacional de Loja
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

// const defaultTheme = createTheme();

// export default function IniciarSesion() {
//     const [email, setEmail] = useState('');
//     const [clave, setClave] = useState('');
//     const { iniciarSesion, cerrarSesion } = useSesionUsuario();
//     const [error, setError] = useState(null);
//     const [mostrarRegistro, setMostrarRegistro] = useState(false);
//     const [openSnackbar, setOpenSnackbar] = useState(false);

//     useEffect(() => {
//         const verificarToken = () => {
//             const token = localStorage.getItem('token');

//             if (token) {
//                 const decodedToken = jwtDecode(token);

//                 if (decodedToken.exp * 1000 < Date.now()) {
//                     cerrarSesion();
//                     setError('La sesión ha expirado. Inicia sesión nuevamente.');
//                     setOpenSnackbar(true);
//                 }
//             }
//         };

//         verificarToken();
//     }, [cerrarSesion]);

//     const handleIniciarSesion = async (e) => {
//         e.preventDefault();
//         if (!email || !clave) {
//             setError('Por favor, complete todos los campos.');
//             setOpenSnackbar(true);
//             return;
//         }

//         if (!validarFormatoEmail(email)) {
//             setError('Ingrese un correo electrónico válido.');
//             setOpenSnackbar(true);
//             return;
//         }

//         try {
//             const response = await axios.post(
//                 `${HOST}/sesionUsuario/autenticacion`,
//                 {
//                     email,
//                     clave,
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         version: '1.0.0',
//                     },
//                 }
//             );

//             const { en, m, token } = response.data;

//             if (en === 1) {
//                 iniciarSesion({ token });
//                 console.log('Sesión iniciada correctamente');
//             } else {
//                 setError(m);
//                 setOpenSnackbar(true);
//                 console.error('Error en autenticación:', m);
//             }
//         } catch (error) {
//             setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
//             setOpenSnackbar(true);
//             console.error('Error en la petición de autenticación:', error);
//         }
//     };

//     const validarFormatoEmail = (correo) => {
//         const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return regexEmail.test(correo);
//     };

//     const handleMostrarRegistro = () => {
//         setMostrarRegistro(true);
//     };

//     const handleCloseSnackbar = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setOpenSnackbar(false);
//     };

//     return (
//         <ThemeProvider theme={defaultTheme}>
//             {!mostrarRegistro ? (
//                 <Grid container component="main" sx={{ height: '100vh' }}>
//                     <CssBaseline />
//                     <Grid
//                         item
//                         xs={false}
//                         sm={4}
//                         md={7}
//                         sx={{
//                             backgroundImage: `url(${LogoCamigoCarrera})`,
//                             backgroundRepeat: 'no-repeat',
//                             backgroundColor: (t) =>
//                                 t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//                             backgroundSize: 'contain',
//                             backgroundPosition: 'center',
//                         }}
//                     />
//                     <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//                         <Box
//                             sx={{
//                                 my: 8,
//                                 mx: 4,
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 alignItems: 'center',
//                             }}
//                         >
//                             <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//                                 <LockOutlinedIcon />
//                             </Avatar>
//                             <Typography component="h1" variant="h5">
//                                 Iniciar sesión
//                             </Typography>
//                             <Box component="form" noValidate onSubmit={handleIniciarSesion} sx={{ mt: 1 }}>
//                                 <TextField
//                                     margin="normal"
//                                     required
//                                     fullWidth
//                                     id="email"
//                                     label="Ingrese su correo electrónico"
//                                     name="email"
//                                     autoComplete="email"
//                                     autoFocus
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                 />
//                                 <TextField
//                                     margin="normal"
//                                     required
//                                     fullWidth
//                                     name="clave"
//                                     label="Ingrese su contraseña"
//                                     type="password"
//                                     id="clave"
//                                     autoComplete="current-password"
//                                     value={clave}
//                                     onChange={(e) => setClave(e.target.value)}
//                                 />
//                                 <Button
//                                     type="submit"
//                                     fullWidth
//                                     variant="contained"
//                                     sx={{ mt: 3, mb: 2 }}
//                                 >
//                                     Iniciar sesión
//                                 </Button>
//                                 <Button
//                                     type="submit"
//                                     fullWidth
//                                     variant="contained"
//                                     color='success'
//                                     sx={{ mt: 3, mb: 2 }}
//                                 >
//                                     IAM Computación
//                                 </Button>
//                                 <Grid container>
//                                     <Grid item>
//                                         <Link variant="body2" onClick={handleMostrarRegistro}>
//                                             {"¿No tienes una cuenta? Regístrate"}
//                                         </Link>
//                                     </Grid>
//                                 </Grid>
//                                 <Copyright sx={{ mt: 5 }} />
//                             </Box>
//                         </Box>
//                     </Grid>
//                 </Grid>
//             ) : (
//                 <RegistrarEstudiante />
//             )}
//             <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//                 <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
//                     {error}
//                 </Alert>
//             </Snackbar>
//         </ThemeProvider>
//     );
// }

//----------------------------------------------------------------
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Keycloak from 'keycloak-js';
import { useSesionUsuario } from '../../context/SesionUsuarioContext';
import { jwtDecode } from 'jwt-decode';
import RegistrarEstudiante from './RegistrarEstudiante';
import LogoCamigoCarrera from '../../assets/images/logoCamigoCarrera.svg';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import keycloak from '../../config/keycloak';
import { useSesionKeycloak } from '../../context/SesionKeycloakContext';



function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright ©'}
            <Link color="inherit" href="https://www.unl.edu.ec/">
                Universidad Nacional de Loja
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function IniciarSesion() {
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const { iniciarSesion, cerrarSesion } = useSesionUsuario();
    const [error, setError] = useState(null);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // const [keycloak, setKeycloak] = useState(null); // Estado para Keycloak
    const [authenticated, setAuthenticated] = useState(false); // Estado de autenticación
    const [userInfo, setUserInfo] = useState(null); // Estado de información del usuario
    const [userInfoAerobase, setUserInfoAerobase] = useState(null);
    const { isAuthenticated, usuarioDetallesKeycloak, iniciarSesionKeycloak, cerrarSesionKeycloak } = useSesionKeycloak();
    const HOST = import.meta.env.VITE_HOST;
    console.log('HOST:', HOST);
    
    

    // Función para iniciar sesión con API tradicional (la que ya tienes)
    const handleIniciarSesionTradicional = async (e) => {
        e.preventDefault();
        if (!email || !clave) {
            setError('Por favor, complete todos los campos.');
            setOpenSnackbar(true);
            return;
        }

        if (!validarFormatoEmail(email)) {
            setError('Ingrese un correo electrónico válido.');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post(
                `${HOST}/sesionUsuario/autenticacion`,
                { email, clave },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        version: '1.0.0',
                    },
                }
            );

            const { en, m, token } = response.data;

            if (en === 1) {
                iniciarSesion({ token });
                console.log('Sesión iniciada correctamente');
            } else {
                setError(m);
                setOpenSnackbar(true);
                console.error('Error en autenticación:', m);
            }
        } catch (error) {
            setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
            setOpenSnackbar(true);
            console.error('Error en la petición de autenticación:', error);
        }
    }; 
    
    const handleIniciarSesionKeycloak = async () => {
        iniciarSesionKeycloak(); // Redirige a la página de inicio de sesión
    };

    const validarFormatoEmail = (correo) => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(correo);
    };

    const handleMostrarRegistro = () => {
        setMostrarRegistro(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            {!mostrarRegistro ? (
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
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Iniciar sesión
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleIniciarSesionTradicional} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Ingrese su correo electrónico"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={clave}
                                    onChange={(e) => setClave(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Iniciar sesión
                                </Button>

                                {/* Botón de autenticación IAM Aerobase (Keycloak) */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="failed"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={ handleIniciarSesionKeycloak}
                                >
                                    Iniciar sesión con Keycloak
                                </Button>

                                <Grid container>
                                    <Grid item>
                                        <Link variant="body2" onClick={handleMostrarRegistro}>
                                            {"¿No tienes una cuenta? Regístrate"}
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Copyright sx={{ mt: 5 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            ) : (
                <RegistrarEstudiante />
            )}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}
