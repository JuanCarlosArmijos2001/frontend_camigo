import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { BookOutlined } from '@mui/icons-material';

const CardSeleccionarTema = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Card sx={{ maxWidth: 300, boxShadow: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                        <BookOutlined sx={{ fontSize: 80, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h6" component="div" gutterBottom textAlign="center">
                        Explora tu interés:
                    </Typography>
                    <Typography variant="h6" component="div" fontWeight="bold" textAlign="center">
                        Selecciona un subtema.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CardSeleccionarTema;