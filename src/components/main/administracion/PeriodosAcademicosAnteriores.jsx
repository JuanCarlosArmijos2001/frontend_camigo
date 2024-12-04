import React, { useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, CircularProgress, Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ModalProgresoUsuario from './ModalProgresoUsuario';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#3864A6',
    color: theme.palette.common.white,
    fontFamily: 'Poppins, sans-serif',
}));

const StyledTableCell = styled(TableCell)({
    fontFamily: 'Poppins, sans-serif',
});

const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
    backgroundColor: selected ? 'lightgray' : 'white',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    cursor: 'pointer',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    margin: '0 auto',
    boxShadow: theme.shadows[3]
}));

const PeriodosAcademicosAnteriores = ({ periodosAcademicos, onClose }) => {
    const [selectedPeriodoAcademico, setSelectedPeriodoAcademico] = useState(null);
    const [resumenProgreso, setResumenProgreso] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const HOST = import.meta.env.VITE_HOST;

    const obtenerResumenProgreso = async (idPeriodoAcademico) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${HOST}/periodoAcademico/resumenProgresoUsuarios`, { idPeriodoAcademico });
            setResumenProgreso(response.data.resumen);
        } catch (error) {
            console.error('Error al obtener el resumen de progreso:', error);
            setResumenProgreso([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePeriodoSelect = (periodo) => {
        setSelectedPeriodoAcademico(periodo);
        obtenerResumenProgreso(periodo.id);
    };

    const handleRowClick = (userId) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: '#3864A6', fontWeight: 'bold' }}>
                    Períodos académicos anteriores
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={onClose}
                    sx={{
                        backgroundColor: '#3864A6',
                        '&:hover': {
                            backgroundColor: '#2A4D7F',
                        },
                    }}
                >
                    Volver a Administración
                </Button>
            </Box>

            <StyledTableContainer component={Paper}>
                {periodosAcademicos.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledHeaderCell align="center">Periodos académicos</StyledHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {periodosAcademicos.map((periodo) => (
                                <StyledTableRow
                                    key={periodo.id}
                                    selected={selectedPeriodoAcademico && selectedPeriodoAcademico.id === periodo.id}
                                    onClick={() => handlePeriodoSelect(periodo)}
                                >
                                    <StyledTableCell align="center">{`${periodo.mesInicio} - ${periodo.mesFin}`}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Box sx={{ padding: 2 }}>
                        <Typography variant="h6" align="center" sx={{ color: '#3864A6' }}>
                            Aún no existen períodos académicos anteriores.
                        </Typography>
                    </Box>
                )}
            </StyledTableContainer>


            {selectedPeriodoAcademico && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: '#3864A6', fontWeight: 'bold', mb: 2 }}>
                        Progreso de los usuarios
                    </Typography>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledHeaderCell>Usuario</StyledHeaderCell>
                                        <StyledHeaderCell>Progreso general</StyledHeaderCell>
                                        <StyledHeaderCell>Progreso en temas</StyledHeaderCell>
                                        <StyledHeaderCell>Progreso en subtemas</StyledHeaderCell>
                                        <StyledHeaderCell>Progreso en ejercicios</StyledHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resumenProgreso.length > 0 ? (
                                        resumenProgreso.map((estudiante) => (
                                            <StyledTableRow
                                                key={estudiante.idUsuario}
                                                onClick={() => handleRowClick(estudiante.idUsuario)}
                                            >
                                                <StyledTableCell>{estudiante.usuario}</StyledTableCell>
                                                <StyledTableCell>{estudiante.progresoGeneral}%</StyledTableCell>
                                                <StyledTableCell>{estudiante.promedioTemas}%</StyledTableCell>
                                                <StyledTableCell>{estudiante.promedioSubtemas}%</StyledTableCell>
                                                <StyledTableCell>{estudiante.promedioEjercicios}%</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <StyledTableCell colSpan={5} align="center">
                                                No hay datos de progreso para este periodo académico
                                            </StyledTableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}

            <ModalProgresoUsuario
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPeriodoAcademico={selectedPeriodoAcademico ? selectedPeriodoAcademico.id : null}
                selectedUserId={selectedUserId}
            />
        </Box>
    );
};

export default PeriodosAcademicosAnteriores;