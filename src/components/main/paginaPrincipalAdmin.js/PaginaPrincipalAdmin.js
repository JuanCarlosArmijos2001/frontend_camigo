import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Table } from 'react-bootstrap';
import RegistrarDocente from '../../administrarSesion/RegistrarDocente';
import RegistrarAdministrador from '../../administrarSesion/RegistrarAdministrador';
import axios from 'axios';

const PaginaPrincipalAdmin = () => {
    const [showDocenteModal, setShowDocenteModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
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

    useEffect(() => {
        obtenerDocentes();
        obtenerAdministradores();
    }, []); // El segundo argumento [] asegura que se ejecute solo una vez al montar el componente

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
                            {docentes.map(docente => (
                                <tr key={docente.email}>
                                    <td>{docente.nombres}</td>
                                    <td>{docente.apellidos}</td>
                                    <td>{docente.email}</td>
                                </tr>
                            ))}
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
                            {administradores.map(admin => (
                                <tr key={admin.email}>
                                    <td>{admin.nombres}</td>
                                    <td>{admin.apellidos}</td>
                                    <td>{admin.email}</td>
                                </tr>
                            ))}
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

            {/* Modal para Registrar Docente */}
            <Modal show={showDocenteModal} onHide={handleDocenteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Docentes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarDocente />
                </Modal.Body>
            </Modal>

            {/* Modal para Registrar Administrador */}
            <Modal show={showAdminModal} onHide={handleAdminModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Administradores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarAdministrador />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default PaginaPrincipalAdmin;
