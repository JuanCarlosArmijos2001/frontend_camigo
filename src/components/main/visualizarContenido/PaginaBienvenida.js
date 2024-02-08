import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function StickyFooter() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <CssBaseline />
                <Container component="main" sx={{ mt: 1, mb: 1 }} maxWidth="sm">
                    <Typography variant="h1" component="h1" gutterBottom>
                        C'amigo
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {"¿Qué es C'amigo?"}
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: 'justify' }}>
                        C'amigo es un software diseñado como herramienta de apoyo especializado en el aprendizaje de programación en C para los laboratorios de la carrera de Computación en la Universidad Nacional de Loja. Este sistema brinda a los estudiantes acceso a material educativo estructurado, como temas, subtemas, ejercicios y preguntas de control.
                    </Typography>
                    <br/>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {"¿En que ayuda C'amigo?"}
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: 'justify' }}>
                    C'amigo facilita a los estudiantes el acceso a contenido específico diseñado para reforzar los conceptos aprendidos en clases de programación en C. La plataforma ofrece un entorno virtual donde los estudiantes pueden revisar, practicar y consolidar su comprensión de los temas abordados en el aula.
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
}