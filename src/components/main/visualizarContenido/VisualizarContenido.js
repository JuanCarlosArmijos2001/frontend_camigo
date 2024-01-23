import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Menu from './Menu';
import MostrarContenido from './MostrarContenido';
import '../../../assets/styles/components/main/visualizarContenido/visualizarContenido.css';

const VisualizarContenido = () => {
    return (
        <Container id='contenedorVC' fluid>
            <Row id='filaVC'>
                <Col md={4} id="columna25">
                    <Menu />
                    
                </Col>
                <Col md={8} id="columnaPrincipal">
                    <MostrarContenido />
                    
                </Col>
            </Row>
        </Container>
    );
};

export default VisualizarContenido;
