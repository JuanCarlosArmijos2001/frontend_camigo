import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GestionarTemas from "../temas/GestionarTemas";
import GestionarSubtemas from "../subtemas/GestionarSubtemas";
import GestionarEjercicio from "../ejercicios/GestionarEjercicios";
import GestionarPregunta from "../preguntas/GestionarPreguntas";
import CardSeleccionarTema from "../../utilities/CardSeleccionarTema";
import CardSeleccionarSubtema from "../../utilities/CardSeleccionarSubtema";
import CardSeleccionarEjercicio from "../../utilities/CardSeleccionarEjercicio";
import "../../../assets/styles/components/main/gestionarContenido.css";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";

export default function GestionarContenido() {
    const { temaSeleccionado } = useTemaSeleccionado();
    const { subtemaSeleccionado } = useSubtemaSeleccionado();
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();

    return (
        <div id="contPrincipal">
            <Container>
                <Row className="filaUno">
                    <Col md={6} className="columnaUno">
                        <GestionarTemas />
                    </Col>
                    <Col md={6} className="columnaDos">
                        {temaSeleccionado ? (
                            <GestionarSubtemas />
                        ) : (
                            <CardSeleccionarTema />
                        )}
                    </Col>
                </Row>
                <Row className="filaDos">
                    <Col md={6} className="columnaUno">
                        {subtemaSeleccionado ? (
                            <GestionarEjercicio />
                        ) : (
                            <CardSeleccionarSubtema />
                        )}
                    </Col>
                    <Col md={6} className="columnaDos">
                        {ejercicioSeleccionado ? (
                            <GestionarPregunta />
                        ) : (
                            <CardSeleccionarEjercicio />
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}