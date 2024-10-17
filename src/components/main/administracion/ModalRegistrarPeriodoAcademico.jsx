// import React, { useState, useMemo } from 'react';
// import {
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     TextField,
//     MenuItem,
//     Grid,
//     Snackbar,
//     Alert
// } from '@mui/material';

// const meses = [
//     'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
//     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
// ];

// const ModalRegistrarPeriodoAcademico = ({ open, handleClose, onSubmit }) => {
//     const currentYear = new Date().getFullYear();
//     const [mesInicio, setMesInicio] = useState('');
//     const [mesFin, setMesFin] = useState('');
//     const [anio, setAnio] = useState(currentYear);
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: '',
//         severity: 'info'
//     });

//     // Generar array de años permitidos (desde el año actual hasta 2060)
//     const aniosPermitidos = useMemo(() => {
//         const years = [];
//         for (let year = currentYear; year <= 2100; year++) {
//             years.push(year);
//         }
//         return years;
//     }, [currentYear]);

//     const handleSnackbarClose = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setSnackbar({ ...snackbar, open: false });
//     };

//     const showMessage = (message, severity = 'info') => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const validarPeriodo = () => {
//         if (!mesInicio || !mesFin || !anio) {
//             showMessage('Todos los campos son obligatorios', 'error');
//             return false;
//         }

//         const mesInicioIndex = meses.indexOf(mesInicio);
//         const mesFinIndex = meses.indexOf(mesFin);
//         const duracion = (mesFinIndex - mesInicioIndex + 12) % 12 + 1;

//         if (duracion < 5 || duracion > 6) {
//             showMessage('El período académico debe durar entre 5 y 6 meses', 'error');
//             return false;
//         }

//         // Validar que haya al menos un mes de diferencia entre períodos
//         const periodoAnteriorFin = (mesInicioIndex - 1 + 12) % 12;
//         if (periodoAnteriorFin === mesFinIndex) {
//             showMessage('Debe haber al menos un mes de diferencia entre períodos académicos', 'error');
//             return false;
//         }

//         return true;
//     };

//     const handleSubmit = async () => {
//         if (validarPeriodo()) {
//             try {
//                 await onSubmit({ mesInicio, mesFin, anio });
//                 showMessage('Período académico registrado con éxito', 'success');
//                 handleClose();
//             } catch (error) {
//                 showMessage('Error al registrar el período académico: ' + error.message, 'error');
//             }
//         }
//     };

//     return (
//         <>
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>Registrar Período Académico</DialogTitle>
//                 <DialogContent>
//                     <Grid container spacing={2} sx={{ mt: 1 }}>
//                         <Grid item xs={12}>
//                             <TextField
//                                 select
//                                 fullWidth
//                                 label="Mes de inicio"
//                                 value={mesInicio}
//                                 onChange={(e) => setMesInicio(e.target.value)}
//                             >
//                                 {meses.map((mes) => (
//                                     <MenuItem key={mes} value={mes}>
//                                         {mes}
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 select
//                                 fullWidth
//                                 label="Mes de fin"
//                                 value={mesFin}
//                                 onChange={(e) => setMesFin(e.target.value)}
//                             >
//                                 {meses.map((mes) => (
//                                     <MenuItem key={mes} value={mes}>
//                                         {mes}
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 select
//                                 fullWidth
//                                 label="Año"
//                                 value={anio}
//                                 onChange={(e) => setAnio(parseInt(e.target.value, 10))}
//                             >
//                                 {aniosPermitidos.map((year) => (
//                                     <MenuItem key={year} value={year}>
//                                         {year}
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose}>Cancelar</Button>
//                     <Button onClick={handleSubmit}>Registrar</Button>
//                 </DialogActions>
//             </Dialog>
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </>
//     );
// };

// export default ModalRegistrarPeriodoAcademico;

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Snackbar,
    Alert
} from '@mui/material';

const ModalRegistrarPeriodoAcademico = ({ open, handleClose, onSubmit }) => {
    const [mesInicio, setMesInicio] = useState('');
    const [mesFin, setMesFin] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const showMessage = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const validarPeriodo = () => {
        if (!mesInicio || !mesFin) {
            showMessage('Ambas fechas son obligatorias', 'error');
            return false;
        }

        const inicio = new Date(mesInicio);
        const fin = new Date(mesFin);
        const diffTime = Math.abs(fin - inicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = diffDays / 30;

        if (diffMonths < 5 || diffMonths > 6) {
            showMessage('El período académico debe durar entre 5 y 6 meses', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validarPeriodo()) {
            try {
                await onSubmit({ mesInicio, mesFin });
                showMessage('Período académico registrado con éxito', 'success');
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } catch (error) {
                showMessage('Error al registrar el período académico: ' + error.message, 'error');
            }
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Registrar Período Académico</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Fecha de inicio"
                                type="date"
                                value={mesInicio}
                                onChange={(e) => setMesInicio(e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Fecha de fin"
                                type="date"
                                value={mesFin}
                                onChange={(e) => setMesFin(e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Registrar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ModalRegistrarPeriodoAcademico;