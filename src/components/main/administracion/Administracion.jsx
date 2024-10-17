import React, { useState, useEffect, useRef } from 'react';
import {
    Container, Grid, Button, Dialog, DialogContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Box, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RegistrarDocente from '../../administrarSesion/RegistrarDocente';
import RegistrarAdministrador from '../../administrarSesion/RegistrarAdministrador';
import ModalRegistrarPeriodoAcademico from './ModalRegistrarPeriodoAcademico';
import PeriodosAcademicosAnteriores from './PeriodosAcademicosAnteriores';
import axios from 'axios';
import ConfirmacionNuevoPeriodoAcademico from '../../utilities/ConfirmacionNuevoPeriodoAcademico';
import ResumenProgresoUsuarios from '../visualizarContenido/ResumenProgresoUsuarios';

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#3864A6',
    color: theme.palette.common.white,
    fontFamily: 'Poppins, sans-serif',
}));

const StyledSubHeaderCell = styled(TableCell)({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
});

const StyledTableCell = styled(TableCell)({
    fontFamily: 'Poppins, sans-serif',
});

const StyledTable = styled(Table)({
    fontFamily: 'Poppins, sans-serif',
});

const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
    backgroundColor: selected ? 'lightgray' : 'white',
    '&:hover': {
        backgroundColor: selected ? 'lightgray' : theme.palette.action.hover,
    },
}));

const Administracion = () => {
    const [showDocenteModal, setShowDocenteModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [docentes, setDocentes] = useState([]);
    const [administradores, setAdministradores] = useState([]);
    const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
    const [selectedPeriodoAcademico, setSelectedPeriodoAcademico] = useState(null);
    const [isPeriodoModalOpen, setIsPeriodoModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [showPeriodosAnteriores, setShowPeriodosAnteriores] = useState(false);
    const [shouldUpdateResumen, setShouldUpdateResumen] = useState(0);

    useEffect(() => {
        obtenerDocentes();
        obtenerAdministradores();
        obtenerPeriodosAcademicos();
    }, []);

    useEffect(() => {
        if (selectedPeriodoAcademico) {
            obtenerResumenProgreso(selectedPeriodoAcademico.id);
        }
    }, [selectedPeriodoAcademico]);

    const handleDocenteModalShow = () => setShowDocenteModal(true);
    const handleDocenteModalClose = () => {
        setShowDocenteModal(false);
        obtenerDocentes();
    };

    const handleAdminModalShow = () => setShowAdminModal(true);
    const handleAdminModalClose = () => {
        setShowAdminModal(false);
        obtenerAdministradores();
    };

    const obtenerDocentes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/sesionUsuario/listarDocentes`);
            setDocentes(response.data);
        } catch (error) {
            console.error('Error al obtener docentes:', error);
        }
    };

    const obtenerAdministradores = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/sesionUsuario/listarAdministradores`);
            setAdministradores(response.data);
        } catch (error) {
            console.error('Error al obtener administradores:', error);
        }
    };

    const obtenerPeriodosAcademicos = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/periodoAcademico/listarPeriodosAcademicosAnteriores`);
            const periodos = response.data.periodos;
            console.log('PERIODOS ACADEMICOS:', periodos);
            setPeriodosAcademicos(periodos);
        } catch (error) {
            console.error('Error al obtener periodos académicos:', error);
        }
    };

    const showModalRegistrarPeriodoAcademico = () => {
        setIsConfirmationOpen(true);
    };

    const handleConfirmNewPeriod = () => {
        setIsConfirmationOpen(false);
        setIsPeriodoModalOpen(true);
    };

    const handlePeriodoModalClose = () => {
        setIsPeriodoModalOpen(false);
    };

    const handlePeriodoSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/periodoAcademico/registrarPeriodoAcademico', data);
            if (response.data.en === 1) {
                console.log('Período académico registrado con éxito');
                obtenerPeriodosAcademicos();
                handlePeriodoModalClose();
                setShouldUpdateResumen(prev => prev + 1);
            } else {
                console.error('Error al registrar el período académico:', response.data.m);
            }
        } catch (error) {
            console.error('Error al registrar el período académico:', error);
        }
    };

    const handleShowPeriodosAnteriores = () => {
        setShowPeriodosAnteriores(true);
    };

    const handleClosePeriodosAnteriores = () => {
        setShowPeriodosAnteriores(false);
    };

    if (showPeriodosAnteriores) {
        return (
            <PeriodosAcademicosAnteriores
                periodosAcademicos={periodosAcademicos}
                onClose={handleClosePeriodosAnteriores}
            />
        );
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
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
                        Administración
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <StyledHeaderCell colSpan={3} align="center">Listado de Docentes</StyledHeaderCell>
                                </TableRow>
                                <TableRow>
                                    <StyledSubHeaderCell align="center">Nombres</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Apellidos</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Email</StyledSubHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {docentes.length > 0 ? (
                                    docentes.map(docente => (
                                        <TableRow key={docente.email}>
                                            <StyledTableCell align="center">{docente.nombres}</StyledTableCell>
                                            <StyledTableCell align="center">{docente.apellidos}</StyledTableCell>
                                            <StyledTableCell align="center">{docente.email}</StyledTableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <StyledTableCell colSpan={3} align="center">No existen docentes</StyledTableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </StyledTable>
                    </TableContainer>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" onClick={handleDocenteModalShow}>
                            Registrar Docentes
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <StyledHeaderCell colSpan={3} align="center">Listado de Administradores</StyledHeaderCell>
                                </TableRow>
                                <TableRow>
                                    <StyledSubHeaderCell align="center">Nombres</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Apellidos</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Email</StyledSubHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {administradores.length > 0 ? (
                                    administradores.map(admin => (
                                        <TableRow key={admin.email}>
                                            <StyledTableCell align="center">{admin.nombres}</StyledTableCell>
                                            <StyledTableCell align="center">{admin.apellidos}</StyledTableCell>
                                            <StyledTableCell align="center">{admin.email}</StyledTableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <StyledTableCell colSpan={3} align="center">No existen administradores</StyledTableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </StyledTable>
                    </TableContainer>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={handleAdminModalShow}>
                            Registrar Administradores
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={showModalRegistrarPeriodoAcademico}
                        >
                            Registrar Periodo Académico
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" sx={{ color: '#3864A6', fontWeight: 'bold', textAlign: 'center' }}>
                            Progreso de los estudiantes en C'amigo en el periodo académico actual
                        </Typography>
                        <ResumenProgresoUsuarios key={shouldUpdateResumen} />
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                                Si deseas consultar el progreso de los estudiantes en periodos académicos anteriores, puedes hacerlo aquí:
                            </Typography>
                            <Grid item xs={12} md={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        onClick={handleShowPeriodosAnteriores}
                                    >
                                        Ver periodos académicos anteriores
                                    </Button>
                                </Box>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>

            </Grid>

            <Dialog open={showDocenteModal} onClose={handleDocenteModalClose}>
                <DialogContent>
                    <RegistrarDocente
                        obtenerDocentes={obtenerDocentes}
                        onClose={handleDocenteModalClose}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showAdminModal} onClose={handleAdminModalClose}>
                <DialogContent>
                    <RegistrarAdministrador
                        obtenerAdministradores={obtenerAdministradores}
                        onClose={handleAdminModalClose}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmacionNuevoPeriodoAcademico
                open={isConfirmationOpen}
                onClose={() => setIsConfirmationOpen(false)}
                onConfirm={handleConfirmNewPeriod}
            />

            <ModalRegistrarPeriodoAcademico
                open={isPeriodoModalOpen}
                handleClose={handlePeriodoModalClose}
                onSubmit={handlePeriodoSubmit}
            />

            {showPeriodosAnteriores && (
                <PeriodosAcademicosAnteriores
                    periodosAcademicos={periodosAcademicos}
                    onClose={() => setShowPeriodosAnteriores(false)}
                />
            )}
        </Container>
    );
};

export default Administracion;