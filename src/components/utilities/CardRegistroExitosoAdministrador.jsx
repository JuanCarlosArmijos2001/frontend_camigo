import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const CardRegistroExitosoAdministrador = ({ onClose }) => {
    return (
        <Card sx={{ maxWidth: 345, m: 2, position: 'relative' }}>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                    <HowToRegIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" component="div" gutterBottom>
                        Administrador registrado con éxito
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        El nuevo administrador ha sido añadido correctamente al sistema.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CardRegistroExitosoAdministrador;