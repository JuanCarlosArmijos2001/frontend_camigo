import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ConfirmacionActivarDesactivarContenido = ({
    open,
    onClose,
    onConfirm,
    itemSeleccionado,
    tipoItem
}) => {
    if (!itemSeleccionado) return null;

    const estaActivado = itemSeleccionado.estado === 1;
    const accion = estaActivado ? 'desactivar' : 'activar';

    const obtenerMensaje = () => {
        const mensajeBase = estaActivado
            ? "Estimado docente, le informamos que al desactivar un contenido, este dejará de estar visible para los estudiantes y no podrán acceder a los contenidos posteriores relacionados"
            : "Estimado docente, Al activar el contenido, los estudiantes podrán acceder a este material y a todo el contenido asociado al mismo.";

        switch (tipoItem) {
            case 'tema':
                return `${mensajeBase}, como subtemas, ejercicios y preguntas.`;
            case 'subtema':
                return `${mensajeBase}, como ejercicios y preguntas relacionadas.`;
            case 'ejercicio':
                return `${mensajeBase}, incluyendo las preguntas asociadas a este ejercicio.`;
            case 'pregunta':
                return `${mensajeBase}.`;
            default:
                return mensajeBase;
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmación</DialogTitle>
            <DialogContent>
                <Typography>
                    {obtenerMensaje()}
                </Typography>
                <Typography mt={2}>
                    ¿Está seguro de que desea {accion} este {tipoItem}?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmacionActivarDesactivarContenido;