import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { styled } from '@mui/material/styles';

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

const ModalProgresoUsuario = ({ open, onClose, selectedPeriodoAcademico, selectedUserId }) => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open && selectedPeriodoAcademico && selectedUserId) {
            fetchProgressData();
        }
    }, [open, selectedPeriodoAcademico, selectedUserId]);

    const fetchProgressData = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/periodoAcademico/detallesProgresoCompleto', {
                idPeriodoAcademico: selectedPeriodoAcademico,
                idUsuario: selectedUserId
            });
            setProgressData(response.data.detalles);
        } catch (error) {
            console.error('Error fetching progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeHtmlTags = (str) => {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Progreso detallado del estudiante.
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper}>
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <StyledHeaderCell colSpan={6} align="center">Progreso detallado</StyledHeaderCell>
                                </TableRow>
                                <TableRow>
                                    <StyledSubHeaderCell align="center">Tema</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Progreso</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Subtema</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Progreso</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Ejercicio</StyledSubHeaderCell>
                                    <StyledSubHeaderCell align="center">Progreso</StyledSubHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {progressData.map((tema) => (
                                    tema.subtemas.map((subtema) => (
                                        subtema.ejercicios.length > 0 ? (
                                            subtema.ejercicios.map((ejercicio, index) => (
                                                <TableRow key={`${tema.tema}-${subtema.subtema}-${ejercicio.ejercicio}`}>
                                                    {index === 0 && (
                                                        <>
                                                            <StyledTableCell rowSpan={subtema.ejercicios.length}>{removeHtmlTags(tema.tema)}</StyledTableCell>
                                                            <StyledTableCell rowSpan={subtema.ejercicios.length}>{tema.progreso}%</StyledTableCell>
                                                            <StyledTableCell rowSpan={subtema.ejercicios.length}>{removeHtmlTags(subtema.subtema)}</StyledTableCell>
                                                            <StyledTableCell rowSpan={subtema.ejercicios.length}>{subtema.progreso}%</StyledTableCell>
                                                        </>
                                                    )}
                                                    <StyledTableCell>{removeHtmlTags(ejercicio.ejercicio)}</StyledTableCell>
                                                    <StyledTableCell>{ejercicio.progreso}%</StyledTableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow key={`${tema.tema}-${subtema.subtema}`}>
                                                <StyledTableCell>{removeHtmlTags(tema.tema)}</StyledTableCell>
                                                <StyledTableCell>{tema.progreso}%</StyledTableCell>
                                                <StyledTableCell>{removeHtmlTags(subtema.subtema)}</StyledTableCell>
                                                <StyledTableCell>{subtema.progreso}%</StyledTableCell>
                                                <StyledTableCell>-</StyledTableCell>
                                                <StyledTableCell>-</StyledTableCell>
                                            </TableRow>
                                        )
                                    ))
                                ))}
                            </TableBody>
                        </StyledTable>
                    </TableContainer>
                )}
                {!loading && progressData.length === 0 && (
                    <Typography>No hay datos de progreso disponibles para este usuario en el período seleccionado.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ModalProgresoUsuario;