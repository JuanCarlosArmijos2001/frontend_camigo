import React, { useState, useEffect, useRef } from "react";
import { ButtonGroup, Container, Col, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import "../../../assets/styles/components/main/visualizarContenido/menu.css";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";

const Menu = () => {
    const { temaSeleccionado, actualizarTemaSeleccionado } = useTemaSeleccionado();
    const { subtemaSeleccionado, actualizarSubtemaSeleccionado } = useSubtemaSeleccionado();
    const [temas, setTemas] = useState([]);
    const [subtemas, setSubtemas] = useState(null);
    const subtemaRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        cargarTemas();
    }, []);

    useEffect(() => {
        if (temaSeleccionado) {
            cargarSubtemas(temaSeleccionado.id);
        } else {
            setSubtemas(null);
            actualizarSubtemaSeleccionado(null);
        }
    }, [temaSeleccionado]);

    const cargarTemas = () => {
        const parametros = {
            mensaje: "temasActivos",
        };

        axios
            .post("http://localhost:5000/temas/listarTemas", parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    setTemas(response.data.temas);
                } else {
                    console.log("Hubo un problema al cargar los temas");
                }
            })
            .catch((error) => {
                console.error("Error al obtener los temas:", error);
            });
    };

    const cargarSubtemas = (idTema) => {
        const parametros = {
            mensaje: "subtemasActivos",
            idTema: idTema,
        };

        axios
            .post("http://localhost:5000/subtemas/listarSubtemas", parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    setSubtemas(response.data.subtemas);
                } else {
                    console.log("Hubo un problema al cargar los subtemas");
                    setSubtemas([]);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los subtemas:", error);
            });
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const handleTemaClick = (tema) => {
        actualizarTemaSeleccionado(tema);
        // No actualizamos el contexto de subtemas aquí
    };

    const handleSubtemaClick = (subtema) => {
        // Verificamos que haya un subtema antes de actualizar el contexto
        if (subtema) {
            actualizarSubtemaSeleccionado(subtema);

            // Hacer scroll hacia el DropdownButton del subtema seleccionado
            if (subtemaRef.current) {
                subtemaRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <Container ref={menuRef}>
            <Row>
                <Col className="text-center">
                    <h1>Temas</h1>
                </Col>
            </Row>
            <Row>
                <Col className="buttonGroupContainer">
                    <ButtonGroup className="me-2" aria-label="First group" vertical>
                        {temas.map((tema) => (
                            <DropdownButton
                                title={cleanHtmlTags(tema.titulo)}
                                id={`dropdown-${tema.id}`}
                                key={tema.id}
                                onClick={() => handleTemaClick(tema)}
                            >
                                {subtemas !== null ? (
                                    subtemas.length > 0 ? (
                                        subtemas.map((subtema) => (
                                            <Dropdown.Item
                                                key={subtema.id}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSubtemaClick(subtema);
                                                }}
                                                // Añadir ref para el DropdownButton del subtema seleccionado
                                                ref={subtema === subtemaSeleccionado ? subtemaRef : null}
                                            >
                                                {cleanHtmlTags(subtema.titulo)}
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <Dropdown.Item disabled>No existen subtemas</Dropdown.Item>
                                    )
                                ) : null}
                            </DropdownButton>
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default Menu;
