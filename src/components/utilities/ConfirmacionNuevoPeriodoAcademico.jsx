import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Checkbox,
    FormControlLabel
} from '@mui/material';

const ConfirmacionNuevoPeriodoAcademico = ({
    open,
    onClose,
    onConfirm
}) => {
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Nuevo Periodo Académico</DialogTitle>
            <DialogContent>
                <Typography variant="body1" paragraph>
                    Estimado administrador, antes de crear el periodo académico debe tener en cuenta los siguientes puntos:
                </Typography>
                <ul>
                    <li>
                        <Typography variant="body2">
                            El progreso de todos los usuarios se volverá a reiniciar
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            El progreso de los usuarios será guardado en su periodo académico correspondiente
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            Usted podrá revisar el contenido en la sección de administración
                        </Typography>
                    </li>
                </ul>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={handleCheckboxChange}
                            color="primary"
                        />
                    }
                    label="He leído los puntos anteriores y quiero crear un nuevo periodo académico"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={onConfirm}
                    color="primary"
                    disabled={!checked}
                >
                    Crear Periodo Académico
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmacionNuevoPeriodoAcademico;