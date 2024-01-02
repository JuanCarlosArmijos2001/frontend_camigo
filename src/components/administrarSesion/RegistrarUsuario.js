import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import CardRegistroExitoso from '../utilities/CardRegistroExitoso';
import "../../assets/styles/components/administrarSesion/RegistrarUsuario.css";
import { v4 as uuidv4 } from 'uuid';

const RegistrarUsuario = () => {

    const [usuario, setUsuario] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        clave: '',
        tipoRol: 'estudiante',
        externalId: uuidv4(),
    });

    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [error, setError] = useState(null);

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
        console.log("External ID:")
        console.log(usuario.externalId);
        const emptyFields = Object.values(usuario).some((field) => field.trim() === "");
        //Control campos vacios
        if (emptyFields) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        // Validar que haya exactamente dos nombres
        const regexNombres = /^\S+(\s\S+){1}$/;
        if (!regexNombres.test(usuario.nombres.trim())) {
            setError("Por favor, ingrese sus dos nombres.");
            return;
        }
        // Validar que haya exactamente dos apellidos
        const regexApellidos = /^\S+(\s\S+){1}$/;
        if (!regexApellidos.test(usuario.apellidos.trim())) {
            setError("Por favor, ingrese sus dos apellidos.");
            return;
        }
        //Control email valido
        if (!validateEmail(usuario.email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            const usuarioConExternalId = { ...usuario, external_id: usuario.externalId };
            const response = await axios.post(
                'http://localhost:5000/sesionUsuario/registro',
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

    return (
        <div>
            {!registroExitoso ? (
                <Form onSubmit={handleSubmit} className="formulario-registro">
                    {error && (
                        <Alert variant="danger" dismissible onClose={handleAlertClose}>
                            {error}
                        </Alert>
                    )}
                    <Form.Group controlId="nombres" className="campo-formulario">
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombres"
                            value={usuario.nombres}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="apellidos" className="campo-formulario">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            name="apellidos"
                            value={usuario.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="email" className="campo-formulario">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={usuario.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="clave" className="campo-formulario">
                        <Form.Label>Clave</Form.Label>
                        <Form.Control
                            type="password"
                            name="clave"
                            value={usuario.clave}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="tipoRol" className="campo-formulario">
                        <Form.Label>Tipo de Rol</Form.Label>
                        <Form.Control
                            as="select"
                            name="tipoRol"
                            value={usuario.tipoRol}
                            onChange={handleChange}
                            required
                        >
                            <option value="docente">Docente</option>
                            <option value="estudiante">Estudiante</option>
                        </Form.Control>
                    </Form.Group>

                    <Button variant="success" type="submit" className="boton-registrarse">
                        Registrarse
                    </Button>
                </Form>
            ) : (
                <CardRegistroExitoso />
            )}
        </div>

    );
};

export default RegistrarUsuario;
