import React from "react";
import GestionarTemas from "./temas/GestionarTemas";
import GestionarSubtemas from "./subtemas/GestionarSubtemas";
import GestionarEjercicio from "./ejercicios/GestionarEjercicios";
import GestionarPregunta from "./preguntas/GestionarPreguntas";
import CEditor from "./CEditor";
import CardSeleccionarTema from "../utilities/CardSeleccionarTema";
import CardSeleccionarSubtema from "../utilities/CardSeleccionarSubtema";
import CardSeleccionarEjercicio from "../utilities/CardSeleccionarEjercicio";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../assets/styles/components/main/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTemaSeleccionado } from "../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../context/EjercicioSeleccionadoContext";

export default function Main() {

  const { temaSeleccionado } = useTemaSeleccionado();
  const { subtemaSeleccionado } = useSubtemaSeleccionado();
  const { ejercicioSeleccionado } = useEjercicioSeleccionado();
  return (
    <div>
      <Container fluid id="contenedor">
        <Row id="fila1">
          <Col id="columna1">
            <GestionarTemas />
          </Col>
          <Col id="columna2">
            {temaSeleccionado ? (
              <GestionarSubtemas />
            ) : (
              <CardSeleccionarTema />
            )}

          </Col>
        </Row>
        <Row id="fila2">
          <Col id="columna1">
            {subtemaSeleccionado ? (
              <GestionarEjercicio />
            ) : (
              <CardSeleccionarSubtema />
            )}
          </Col>
          <Col id="columna2">
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
