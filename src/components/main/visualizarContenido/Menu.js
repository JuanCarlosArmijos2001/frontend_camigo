import React, { useState, useEffect } from "react";
import { ButtonGroup, Button, Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import "../../../assets/styles/components/main/visualizarContenido/menu.css";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";

const Menu = () => {
    const [temas, setTemas] = useState([]);
    const { temaSeleccionado, actualizarTemaSeleccionado } = useTemaSeleccionado();

    useEffect(() => {
        cargarTemas();
    }, []);

    // const cargarTemas = () => {
    //     const parametros = {
    //         estado: 1,
    //     };

    //     axios
    //         .get("http://localhost:5000/temas/listarTemas", {
    //             parametros,
    //         })
    //         .then((response) => {
    //             if (response.data.en === 1) {
    //                 console.log(response.data);
    //                 setTemas(response.data.temas);

    //             } else {
    //                 console.log("Hubo un problema al cargar los temas");
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Error al obtener los temas:", error);
    //         });
    // };

    const cargarTemas = () => {
        const parametros = {
            mensaje: "temasActivos",
        };

        axios
            .post("http://localhost:5000/temas/listarTemas", parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    console.log(response.data);
                    setTemas(response.data.temas);
                } else {
                    console.log("Hubo un problema al cargar los temas");
                }
            })
            .catch((error) => {
                console.error("Error al obtener los temas:", error);
            });
    };


    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const handleTemaClick = (tema) => {
        // Actualizar el tema seleccionado en el contexto
        actualizarTemaSeleccionado(tema);
    };

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <h1>Temas</h1>
                </Col>
            </Row>
            <Row>
                <Col className="buttonGroupContainer">
                    <ButtonGroup className="me-2" aria-label="First group" vertical>
                        {temas.map((tema) => (
                            <Button
                                variant="secondary"
                                key={tema.id}
                                onClick={() => handleTemaClick(tema)}
                            >
                                {cleanHtmlTags(tema.titulo)}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default Menu;
