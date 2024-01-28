import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import IniciarSesion from './IniciarSesion';
import RegistrarUsuario from './RegistrarEstudiante';
import '../../assets/styles/components/administrarSesion/ModalAdministrarSesion.css';


export default function ModalAdministrarSesion() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [sesion, setSesion] = useState("iniciarSesion");

    return (
        <>
            <Button variant="success" onClick={handleShow} id="btnModal">
                Iniciar Sesión
            </Button>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Button variant="outline-success" id="btnIniciarSesion" onClick={() => setSesion('iniciarSesion')}>Iniciar Sesión</Button>{' '}
                    <Button variant="outline-info" id="btnRegistroUsuario" onClick={() => setSesion('registrarUsuario')}>Registrarse</Button>{' '}
                </Modal.Header>
                <Modal.Body>
                    {sesion === 'iniciarSesion' ? <IniciarSesion handleClose={handleClose} /> : <RegistrarUsuario />}
                </Modal.Body>
            </Modal>
        </>
    );
}