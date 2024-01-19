import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import GestionarContenidoComponent from '../gestionarContenido/GestionarContenido';
import VisualizarContenidoComponent from '../visualizarContenido/VisualizarContenido';
import '../../../assets/styles/components/main/paginaPrincipalDocente/paginaPrincipalDocente.css';

const GestionarContenido = () => (
    <Row>
        <Col>
            <GestionarContenidoComponent />
        </Col>
    </Row>
);

const VisualizarContenido = () => (
    <Row>
        <Col>
            <VisualizarContenidoComponent />
        </Col>
    </Row>
);

const PaginaPrincipalDocente = () => {
    const [modo, setModo] = useState('gestionar');

    const cambiarModo = () => {
        setModo(modo === 'gestionar' ? 'visualizar' : 'gestionar');
    };

    return (
        <Container fluid>
            <Row>
                <Col xs={2} className='columna'>
                    <Button variant="primary" onClick={cambiarModo} id='btnComponente'>
                        {modo === 'gestionar' ? 'Visualizar contenido' : 'Gestionar contenido'}
                    </Button>
                </Col>
                <Col xs={8} className="text-center" id='tituloComponente'>
                    {modo === 'gestionar' ? 'Gestionar contenido' : 'Visualizar contenido'}
                </Col>
            </Row>
            {modo === 'gestionar' ? <GestionarContenido /> : <VisualizarContenido />}
        </Container>
    );
};

export default PaginaPrincipalDocente;
