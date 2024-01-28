import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import axios from "axios";

const ModalEditarUsuario = ({ show, onHide }) => {
    const { usuarioDetalles, cerrarSesion} = useSesionUsuario();
    const [nuevosDatos, setNuevosDatos] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        nuevaClave: "",
        confirmarClave: "",
    });
    const [errorClave, setErrorClave] = useState(null);

    useEffect(() => {
        // Cargar datos actuales del usuario al abrir el modal
        if (usuarioDetalles) {
            setNuevosDatos({
                nombres: usuarioDetalles.detallesPersona.nombres,
                apellidos: usuarioDetalles.detallesPersona.apellidos,
                email: usuarioDetalles.detallesCuenta.email,
                nuevaClave: "",
                confirmarClave: "",
            });
        }
    }, [show, usuarioDetalles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevosDatos((prevDatos) => ({ ...prevDatos, [name]: value }));
    };

    const handleGuardarCambios = async () => {
        // Validar que las nuevas claves coincidan
        if (nuevosDatos.nuevaClave !== nuevosDatos.confirmarClave) {
            setErrorClave("Las nuevas claves no coinciden");
            return;
        }

        try {
            const response = await axios.put(
                "http://localhost:5000/sesionUsuario/editarUsuario",
                {
                    userId: usuarioDetalles.userId,
                    nombres: nuevosDatos.nombres,
                    apellidos: nuevosDatos.apellidos,
                    email: nuevosDatos.email,
                    clave: nuevosDatos.nuevaClave,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            const { en, m } = response.data;

            if (en === 1) {
                console.log("Usuario actualizado exitosamente");
                alert("Usuario actualizado exitosamente, los cambios se verán reflejados al iniciar sesión nuevamente");
                onHide();
            } else {
                console.error("Error al actualizar el usuario:", m);
            }
        } catch (error) {
            console.error("Error en la petición para actualizar el usuario:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNombres">
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa tus nombres"
                            name="nombres"
                            value={nuevosDatos.nombres}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formApellidos">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa tus apellidos"
                            name="apellidos"
                            value={nuevosDatos.apellidos}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingresa tu email"
                            name="email"
                            value={nuevosDatos.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formNuevaClave">
                        <Form.Label>Nueva Clave</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa tu nueva clave"
                            name="nuevaClave"
                            value={nuevosDatos.nuevaClave}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formConfirmarClave">
                        <Form.Label>Confirmar Clave</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirma tu nueva clave"
                            name="confirmarClave"
                            value={nuevosDatos.confirmarClave}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {errorClave && <p className="text-danger">{errorClave}</p>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleGuardarCambios}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEditarUsuario;
