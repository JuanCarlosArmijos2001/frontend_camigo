import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import CardRegistroExitosoDocente from '../utilities/CardRegistroExitosoDocente';
import { v4 as uuidv4 } from 'uuid';

const StyledPaper = styled(Paper)({
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
    margin: '0 auto',
    maxWidth: '400px',
    width: '100%',
});

const StyledTextField = styled(TextField)({
    marginBottom: '0.75rem',
    '& .MuiInputBase-root': {
        height: '2.5rem',
    },
    '& .MuiInputLabel-root': {
        transform: 'translate(14px, 8px) scale(1)',
    },
    '& .MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
    },
});

const StyledButton = styled(Button)({
    height: '2.5rem',
    fontSize: '0.9rem',
    fontWeight: 'bold',
});


const RegistrarDocente = ({ obtenerDocentes, onClose }) => {
    const [usuario, setUsuario] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        clave: '',
        tipoRol: 'docente',
        externalId: uuidv4(),
    });

    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [error, setError] = useState(null);
    const HOST = import.meta.env.VITE_HOST;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(usuario.externalId);
        const emptyFields = Object.values(usuario).some((field) => field.trim() === "");
        if (emptyFields) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        const regexNombres = /^\S+(\s\S+){1}$/;
        if (!regexNombres.test(usuario.nombres.trim())) {
            setError("Por favor, ingrese sus dos nombres.");
            return;
        }
        const regexApellidos = /^\S+(\s\S+){1}$/;
        if (!regexApellidos.test(usuario.apellidos.trim())) {
            setError("Por favor, ingrese sus dos apellidos.");
            return;
        }
        if (!validateEmail(usuario.email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            const usuarioConExternalId = { ...usuario, external_id: usuario.externalId };
            const response = await axios.post(
                `${HOST}/sesionUsuario/registro`,
                usuarioConExternalId,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'version': '1.0.0',
                    },
                }
            );

            const { en, m } = response.data;

            if (en === 1) {
                console.log('Registro exitoso:', m);
                setRegistroExitoso(true);
                obtenerDocentes();
            } else {
                console.error('Error en el registro:', m);
            }
        } catch (error) {
            console.error('Error al enviar los datos al backend:', error);
        }
    };

    const handleAlertClose = () => {
        setError(null);
    };

    const handleRegistroExitoso = () => {
        setRegistroExitoso(true);
        obtenerDocentes();
    };

    const handleCerrarTodo = () => {
        setRegistroExitoso(false);
        onClose();
    };


    return (
        <StyledPaper elevation={3}>
            {!registroExitoso ? (
                <>
                    <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 2 }}>
                        Registrar Docente
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        {error && (
                            <Alert severity="error" onClose={handleAlertClose} sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <StyledTextField
                            label="Nombres"
                            name="nombres"
                            value={usuario.nombres}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <StyledTextField
                            label="Apellidos"
                            name="apellidos"
                            value={usuario.apellidos}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <StyledTextField
                            label="Email"
                            name="email"
                            type="email"
                            value={usuario.email}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <StyledTextField
                            label="Clave"
                            name="clave"
                            type="password"
                            value={usuario.clave}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                onClick={onClose}
                                sx={{ width: '48%' }}
                            >
                                Cancelar
                            </StyledButton>
                            <StyledButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ width: '48%' }}
                            >
                                Registrarse
                            </StyledButton>
                        </Box>
                    </Box>
                </>
            ) : (
                <CardRegistroExitosoDocente onClose={handleCerrarTodo} />
            )}
        </StyledPaper>
    );
};

export default RegistrarDocente;