import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    IconButton,
    Paper,
    useMediaQuery,
} from '@mui/material';
import {
    Email,
    Facebook,
    LinkedIn,
    PlayArrow,
    CloudDownload,
} from '@mui/icons-material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { keyframes } from '@mui/system';

import IniciarSesion from '../administrarSesion/IniciarSesion';
import logoCarrera from '../../assets/images/logoCamigoCarrera.svg';
import manualEstudiante from '../../assets/pdfs/manual_estudiante.pdf';
import manualDocente from '../../assets/pdfs/manual_docente.pdf';

let theme = createTheme({
    palette: {
        primary: {
            main: '#3864A6',
            light: '#5A86C8',
            dark: '#1A4580',
        },
        secondary: {
            main: '#FF6B6B',
        },
        background: {
            default: '#F0F4F8',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h4: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 30,
                    textTransform: 'none',
                    padding: '10px 24px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export default function PaginaInicio() {
    const [mostrarInicioSesion, setMostrarInicioSesion] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleInicioSesion = () => {
        setMostrarInicioSesion(!mostrarInicioSesion);
    };

    if (mostrarInicioSesion) {
        return <IniciarSesion onClose={toggleInicioSesion} />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                py: 4,
            }}>
                <Container maxWidth="lg">
                    {/* Sección de Bienvenida con Logo */}
                    <Paper elevation={3} sx={{
                        textAlign: 'center',
                        mb: 6,
                        py: 8,
                        px: 4,
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F4F8 100%)',
                        animation: `${fadeInUp} 1s ease-out`,
                    }}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={4}>
                                {/* Sección de Logo */}
                                <Box sx={{
                                    width: '100%',
                                    height: 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2,
                                    mb: { xs: 2, md: 0 },
                                    overflow: 'hidden',
                                }}>
                                    <img
                                        src={logoCarrera}
                                        alt="Logo de C'amigo"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h1" sx={{
                                    mb: 4,
                                    color: 'primary.main',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                                }}>
                                    Bienvenido a C'amigo
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PlayArrow />}
                                    onClick={toggleInicioSesion}
                                    sx={{
                                        fontSize: '1.2rem',
                                        padding: '12px 36px',
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                        animation: `${pulse} 2s infinite`,
                                    }}
                                >
                                    Comenzar
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Sección de Contenido Principal */}
                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box sx={{ animation: `${fadeInUp} 1s ease-out 0.3s both` }}>
                                <Typography variant="h4" gutterBottom color="primary.main" sx={{ fontWeight: 'bold' }}>
                                    ¿Qué es C'amigo?
                                </Typography>
                                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'text.secondary', textAlign: 'justify' }}>
                                    C'amigo es una herramienta educativa para estudiantes de programación en C. Diseñada para complementar las clases presenciales, permite a los usuarios reforzar los temas vistos en el aula y explorar conceptos futuros. Con C'amigo, los estudiantes pueden practicar, repasar y ampliar sus conocimientos en programación en C, adaptándose a su propio ritmo de aprendizaje.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{
                                overflow: 'hidden',
                                animation: `${fadeInUp} 1s ease-out 0.6s both`,
                            }}>
                                <Box sx={{
                                    position: 'relative',
                                    paddingTop: '56.25%',
                                    width: '100%',
                                }}>
                                    <iframe
                                        src="https://www.youtube.com/embed/wyf7Oheb62Q"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            border: 'none',
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Sección de Manuales de Usuario */}
                    <Box sx={{ mb: 6, animation: `${fadeInUp} 1s ease-out 0.9s both` }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center', mb: 4 }}>
                            Manuales de Usuario
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            {[
                                { label: 'Estudiante', pdf: manualEstudiante },
                                { label: 'Docente', pdf: manualDocente }
                            ].map((manual, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<CloudDownload />}
                                        component="a"
                                        href={manual.pdf}
                                        download={`Manual_${manual.label}.pdf`}
                                        sx={{
                                            py: 2,
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 6px 20px rgba(56, 100, 166, 0.3)',
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {manual.label}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Sección de Contacto */}
                    <Paper elevation={3} sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #F0F4F8 0%, #E0E8F0 100%)',
                        animation: `${fadeInUp} 1s ease-out 1.2s both`,
                    }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                            Contáctanos
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                            {[
                                { icon: <Email fontSize="large" />, label: 'Email', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=camigounlcis@gmail.com' },
                                { icon: <Facebook fontSize="large" />, label: 'Facebook', href: 'https://www.facebook.com/cisunl/?locale=es_LA' },
                                { icon: <LinkedIn fontSize="large" />, label: 'LinkedIn', href: 'https://ec.linkedin.com/school/universidad-nacional-de-loja/' }
                            ].map((item, index) => (
                                <IconButton
                                    key={index}
                                    aria-label={item.label}
                                    component="a"
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 6px 20px rgba(56, 100, 166, 0.3)',
                                        },
                                        transition: 'all 0.3s ease',
                                        width: 60,
                                        height: 60,
                                    }}
                                >
                                    {item.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}