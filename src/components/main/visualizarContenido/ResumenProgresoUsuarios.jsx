import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    styled
} from '@mui/material';

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#3864A6',
    color: theme.palette.common.white,
    fontFamily: 'Poppins, sans-serif',
}));

const StyledTableCell = styled(TableCell)({
    fontFamily: 'Poppins, sans-serif',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
}));

const ResumenProgresoUsuarios = () => {
    const [resumenProgreso, setResumenProgreso] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResumenProgreso = async () => {
            try {
                const response = await axios.post('http://localhost:5000/periodoAcademico/resumenProgresoUsuariosActual');
                if (response.data.en === 1) {
                    setResumenProgreso(response.data.resumen);
                } else {
                    setError(response.data.m);
                }
            } catch (err) {
                setError('Error al obtener el resumen de progreso');
            } finally {
                setLoading(false);
            }
        };

        fetchResumenProgreso();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Aún no existe un periodo académico</div>;

    return (
        <Box sx={{ mt: 4 }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledHeaderCell align="center">Usuario</StyledHeaderCell>
                            <StyledHeaderCell align="center">Progreso general</StyledHeaderCell>
                            <StyledHeaderCell align="center">Progreso en temas</StyledHeaderCell>
                            <StyledHeaderCell align="center">Progreso en subtemas</StyledHeaderCell>
                            <StyledHeaderCell align="center">Progreso en ejercicios</StyledHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resumenProgreso.length > 0 ? (
                            resumenProgreso.map((usuario) => (
                                <StyledTableRow key={usuario.idUsuario}>
                                    <StyledTableCell align="center">{usuario.usuario}</StyledTableCell>
                                    <StyledTableCell align="center">{usuario.progresoGeneral}%</StyledTableCell>
                                    <StyledTableCell align="center">{usuario.promedioTemas}%</StyledTableCell>
                                    <StyledTableCell align="center">{usuario.promedioSubtemas}%</StyledTableCell>
                                    <StyledTableCell align="center">{usuario.promedioEjercicios}%</StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <StyledTableCell colSpan={5} align="center">
                                    No hay datos de progreso disponibles
                                </StyledTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ResumenProgresoUsuarios;