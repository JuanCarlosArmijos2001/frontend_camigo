import React, { useState } from 'react';
import '../../assets/styles/components/administrarSesion/PaginaInicio.css';
import IniciarSesion from './IniciarSesion';
import RegistrarUsuario from './RegistrarUsuario';
import { Button, Modal, Card, CardGroup, Container, Row, Col } from 'react-bootstrap';

export default function PaginaInicio() {
    const [showIniciarSesion, setShowIniciarSesion] = useState(false);
    const [showRegistrarUsuario, setShowRegistrarUsuario] = useState(false);

    const handleClose = () => {
        setShowIniciarSesion(false);
        setShowRegistrarUsuario(false);
    };

    const handleIniciarSesionClose = () => {
        setShowIniciarSesion(false);
    };

    return (
        <Container className='contenedorPI' fluid>
            <Row>
                <Col className='colTitulo'>
                    <h1 className="tituloPI">C'amigo</h1>
                    <p>Te damos la bienvenida a C'amigo, tu compañero indispensable para potenciar tu proceso de aprendizaje en programación en C.</p>
                </Col>
            </Row>
            <Row>
                <Col className='colBotonesIniciarRegistrar'>
                    <Button variant="success" onClick={() => setShowIniciarSesion(true)} id="btnIniciarSesión">
                        Iniciar Sesión
                    </Button>
                    <Button variant="primary" onClick={() => setShowRegistrarUsuario(true)} id="btnRegistrar">
                        Registrarse
                    </Button>
                </Col>
            </Row>
            <Row className='colCards'>
                <Col>
                    <CardGroup>
                        <Card>
                            <Card.Body>
                                <Card.Title>¿Qué es C'amigo?</Card.Title>
                                <Card.Text style={{ textAlign: 'justify' }}>
                                    C'amigo es un software diseñado como herramienta de apoyo especializado en el aprendizaje de programación en C para los laboratorios de la carrera de Computación en la Universidad Nacional de Loja. Este sistema brinda a los estudiantes acceso a material educativo estructurado, como temas, subtemas, ejercicios y preguntas de control.
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small>Computación</small>
                            </Card.Footer>
                        </Card>

                        <Card>
                            <Card.Body>
                                <Card.Title>¿En que ayuda C'amigo?</Card.Title>
                                <Card.Text style={{ textAlign: 'justify' }}>
                                    C'amigo facilita a los estudiantes el acceso a contenido específico diseñado para reforzar los conceptos aprendidos en clases de programación en C. La plataforma ofrece un entorno virtual donde los estudiantes pueden revisar, practicar y consolidar su comprensión de los temas abordados en el aula.
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small>Universidad Nacional de Loja</small>
                            </Card.Footer>
                        </Card>

                        <Card>
                            <Card.Body>
                                <Card.Title>Ventajas de usar C'amigo</Card.Title>
                                <Card.Text style={{ textAlign: 'justify' }}>
                                    C'amigo destaca por brindar a los estudiantes acceso directo a contenido específico en programación en C, ofreciendo práctica adicional a través de ejercicios y preguntas de control. Esta herramienta favorece el aprendizaje autónomo al permitir a los estudiantes avanzar a su propio ritmo con contenido teórico y práctico.
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small>Loja-Ecuador</small>
                            </Card.Footer>
                        </Card>
                    </CardGroup>
                </Col>
            </Row>
            <Modal show={showIniciarSesion} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Iniciar Sesión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <IniciarSesion onClose={handleIniciarSesionClose} />
                </Modal.Body>
            </Modal>
            <Modal show={showRegistrarUsuario} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrarse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarUsuario />
                </Modal.Body>
            </Modal>
        </Container>
    );
}