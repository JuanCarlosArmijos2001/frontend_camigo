// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { Paper, Typography, useTheme, CircularProgress, Box, Grid, Button } from '@mui/material';
// import { CloudDownload } from '@mui/icons-material';
// import axios from 'axios';
// import { useSesionUsuario } from '../../../context/SesionUsuarioContext';
// import manualEstudiante from '../../../assets/pdfs/manual_estudiante.pdf';
// import manualDocente from '../../../assets/pdfs/manual_docente.pdf';
// import manualAdministrador from '../../../assets/pdfs/manual_administrador.pdf';

// export default function ValoracionTemas() {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const theme = useTheme();
//     const { usuarioDetalles } = useSesionUsuario();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/valoracion/topTemas');
//                 if (response.data.en === 1) {
//                     const formattedData = response.data.temas.map((tema, index) => ({
//                         name: `${index + 1}°`,
//                         likes: tema.likes,
//                         fullTitle: tema.titulo.replace(/<\/?[^>]+(>|$)/g, "")
//                     }));
//                     setData(formattedData);
//                 } else {
//                     setError(response.data.m);
//                 }
//             } catch (err) {
//                 setError('Error al cargar los datos');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) {
//         return <CircularProgress />;
//     }

//     if (error) {
//         return <Typography color="error">{error}</Typography>;
//     }

//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
//                     <p><strong>{payload[0].payload.fullTitle}</strong></p>
//                     <p>Likes: {payload[0].value}</p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     const manuales = [
//         { label: 'Estudiante', pdf: manualEstudiante, tipo: 'estudiante' },
//         { label: 'Docente', pdf: manualDocente, tipo: 'docente' },
//         { label: 'Administrador', pdf: manualAdministrador, tipo: 'administrador' }
//     ];

//     return (
//         <Box sx={{ maxWidth: 1200, margin: 'auto', fontFamily: 'Poppins, sans-serif' }}>
//             <Grid container spacing={4}>
//                 <Grid item xs={12} md={6}>
//                     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                         <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#3864A6' }}>
//                             Temas destacados
//                         </Typography>
//                         <Typography variant="h5" gutterBottom>
//                             ¡Bienvenido! Aquí te presentamos los 5 temas más populares basados en los "Me gusta" recibidos. Estos temas reflejan el contenido que más ha resonado con nuestra comunidad. ¡Explora y descubre lo que otros encuentran interesante!
//                         </Typography>
//                     </Box>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                     <Paper
//                         elevation={3}
//                         sx={{
//                             p: 4,
//                             borderRadius: 4,
//                             background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`
//                         }}
//                     >
//                         <ResponsiveContainer width="100%" height={400}>
//                             <BarChart
//                                 data={data}
//                                 margin={{
//                                     top: 20,
//                                     right: 30,
//                                     left: 20,
//                                     bottom: 20,
//                                 }}
//                             >
//                                 <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
//                                 <XAxis
//                                     dataKey="name"
//                                     tick={{ fill: theme.palette.text.secondary }}
//                                     axisLine={{ stroke: theme.palette.divider }}
//                                 />
//                                 <YAxis
//                                     tick={{ fill: theme.palette.text.secondary }}
//                                     axisLine={{ stroke: theme.palette.divider }}
//                                 />
//                                 <Tooltip content={<CustomTooltip />} />
//                                 <Bar dataKey="likes" fill="#3864A6" animationDuration={1500} />
//                             </BarChart>
//                         </ResponsiveContainer>
//                         <Typography variant="body2" align="center" sx={{ mt: 2, color: theme.palette.text.secondary }}>
//                             Número de "Me gusta" por tema
//                         </Typography>
//                     </Paper>
//                 </Grid>
//             </Grid>

//             {/* Sección de Manuales de Usuario */}
//             <Box sx={{ mt: 6, mb: 6 }}>
//                 <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3864A6', textAlign: 'center', mb: 4 }}>
//                     Manuales de Usuario
//                 </Typography>
//                 <Grid container spacing={3} justifyContent="center">
//                     {manuales.map((manual, index) => (
//                         usuarioDetalles.detallesRol.tipo === manual.tipo && (
//                             <Grid item xs={12} sm={6} md={4} key={index}>
//                                 <Button
//                                     variant="contained"
//                                     fullWidth
//                                     startIcon={<CloudDownload />}
//                                     component="a"
//                                     href={manual.pdf}
//                                     download={`Manual_${manual.label}.pdf`}
//                                     sx={{
//                                         py: 2,
//                                         backgroundColor: '#3864A6',
//                                         color: 'white',
//                                         '&:hover': {
//                                             backgroundColor: '#2c4f80',
//                                             transform: 'translateY(-3px)',
//                                             boxShadow: '0 6px 20px rgba(56, 100, 166, 0.3)',
//                                         },
//                                         transition: 'all 0.3s ease',
//                                     }}
//                                 >
//                                     {manual.label}
//                                 </Button>
//                             </Grid>
//                         )
//                     ))}
//                 </Grid>
//             </Box>
//         </Box>
//     );
// }

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Typography, useTheme, CircularProgress, Box, Grid, Button } from '@mui/material';
import { CloudDownload } from '@mui/icons-material';
import axios from 'axios';
import { useSesionUsuario } from '../../../context/SesionUsuarioContext';
import manualEstudiante from '../../../assets/pdfs/manual_estudiante.pdf';
import manualDocente from '../../../assets/pdfs/manual_docente.pdf';
import manualAdministrador from '../../../assets/pdfs/manual_administrador.pdf';

export default function ValoracionTemas() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const { usuarioDetalles } = useSesionUsuario();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/valoracion/topTemas');
                if (response.data.en === 1) {
                    const formattedData = response.data.temas.map((tema, index) => ({
                        name: `${index + 1}°`,
                        likes: tema.likes,
                        fullTitle: tema.titulo.replace(/<\/?[^>]+(>|$)/g, "")
                    }));
                    setData(formattedData);
                } else {
                    setData([]);
                }
            } catch (err) {
                setError('Error al cargar los datos. Por favor, intenta nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                    <p><strong>{payload[0].payload.fullTitle}</strong></p>
                    <p>Likes: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    const manuales = [
        { label: 'Estudiante', pdf: manualEstudiante, tipo: 'estudiante' },
        { label: 'Docente', pdf: manualDocente, tipo: 'docente' },
        { label: 'Administrador', pdf: manualAdministrador, tipo: 'administrador' }
    ];

    const NoDataMessage = () => (
        <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#3864A6' }}>
                Aún no existen temas valorados
            </Typography>
            <Typography variant="body1">
                Comunícate con tu docente para que cree nuevos temas interesantes.
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', fontFamily: 'Poppins, sans-serif' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#3864A6' }}>
                                Temas destacados
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                ¡Bienvenido! Aquí te presentamos los 5 temas más populares basados en los "Me gusta" recibidos. Estos temas reflejan el contenido que más ha resonado con nuestra comunidad. ¡Explora y descubre lo que otros encuentran interesante!
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`
                        }}
                    >
                        {data.length > 0 ? (
                            <React.Fragment>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={data}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: theme.palette.text.secondary }}
                                            axisLine={{ stroke: theme.palette.divider }}
                                        />
                                        <YAxis
                                            tick={{ fill: theme.palette.text.secondary }}
                                            axisLine={{ stroke: theme.palette.divider }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="likes" fill="#3864A6" animationDuration={1500} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <Typography variant="body2" align="center" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                                    Número de "Me gusta" por tema
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <NoDataMessage />
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Sección de Manuales de Usuario */}
            <Box sx={{ mt: 6, mb: 6 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3864A6', textAlign: 'center', mb: 4 }}>
                    Manuales de Usuario
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {manuales.map((manual, index) => (
                        usuarioDetalles.detallesRol.tipo === manual.tipo && (
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
                                        backgroundColor: '#3864A6',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#2c4f80',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 6px 20px rgba(56, 100, 166, 0.3)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {manual.label}
                                </Button>
                            </Grid>
                        )
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}