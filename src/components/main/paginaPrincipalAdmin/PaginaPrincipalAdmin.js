import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Table } from 'react-bootstrap';
import RegistrarDocente from '../../administrarSesion/RegistrarDocente';
import RegistrarAdministrador from '../../administrarSesion/RegistrarAdministrador';
import axios from 'axios';

const PaginaPrincipalAdmin = () => {

    useEffect(() => {
        obtenerDocentes();
        obtenerAdministradores();
    }, []);

    const [showDocenteModal, setShowDocenteModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [docentes, setDocentes] = useState([]);
    const [administradores, setAdministradores] = useState([]);

    const handleDocenteModalShow = () => {
        setShowDocenteModal(true);
        obtenerDocentes();
    };

    const handleDocenteModalClose = () => setShowDocenteModal(false);

    const handleAdminModalShow = () => {
        setShowAdminModal(true);
        obtenerAdministradores();
    };

    const handleAdminModalClose = () => setShowAdminModal(false);

    const obtenerDocentes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/sesionUsuario/listarDocentes');
            setDocentes(response.data);
        } catch (error) {
            console.error('Error al obtener docentes:', error);
        }
    };

    const obtenerAdministradores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/sesionUsuario/listarAdministradores');
            setAdministradores(response.data);
        } catch (error) {
            console.error('Error al obtener administradores:', error);
        }
    };

    const resetearProgreso = async () => {
        try {
            const response = await axios.post('http://localhost:5000/preguntas/resetearProgreso');
            setMensaje(response.data.m);
            console.log(mensaje);
        } catch (error) {
            console.error('Error al reiniciar los progresos:', error);
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={6} className="d-flex justify-content-center mt-4">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan="3" className="text-center">Listado de Docentes</th>
                            </tr>
                            <tr>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docentes.length > 0 ? (
                                docentes.map(docente => (
                                    <tr key={docente.email}>
                                        <td>{docente.nombres}</td>
                                        <td>{docente.apellidos}</td>
                                        <td>{docente.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No existen docentes</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
                <Col md={6} className="d-flex justify-content-center mt-4">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan="3" className="text-center">Listado de Administradores</th>
                            </tr>
                            <tr>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {administradores.length > 0 ? (
                                administradores.map(admin => (
                                    <tr key={admin.email}>
                                        <td>{admin.nombres}</td>
                                        <td>{admin.apellidos}</td>
                                        <td>{admin.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No existen administradores</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Botones */}
            <Row className="mt-3">
                <Col md={6} className="d-flex justify-content-center">
                    <Button variant="primary" className="mb-3" onClick={handleDocenteModalShow}>
                        Registrar Docentes
                    </Button>
                </Col>
                <Col md={6} className="d-flex justify-content-center">
                    <Button variant="success" className="mb-3" onClick={handleAdminModalShow}>
                        Registrar Administradores
                    </Button>
                </Col>
            </Row>

            <Row className="mt-3 d-flex justify-content-center" >
                <Col md={6} className="d-flex justify-content-center">
                    <Button variant="warning" className="mb-3" onClick={resetearProgreso}>
                        Cambiar periodo académico
                    </Button>
                </Col>
            </Row>

            {/* Modal para Registrar Docente */}
            <Modal show={showDocenteModal} onHide={handleDocenteModalClose} style={{ zIndex: 1500 }}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Docentes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarDocente obtenerDocentes={obtenerDocentes} />
                </Modal.Body>
            </Modal>

            {/* Modal para Registrar Administrador */}
            <Modal show={showAdminModal} onHide={handleAdminModalClose} style={{ zIndex: 1500 }}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Administradores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarAdministrador obtenerAdministradores={obtenerAdministradores} />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default PaginaPrincipalAdmin;
