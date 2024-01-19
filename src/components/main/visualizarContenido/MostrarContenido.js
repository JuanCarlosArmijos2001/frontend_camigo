import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container, Col, Row } from 'react-bootstrap';
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import Editor from "@monaco-editor/react";

const MostrarContenido = () => {
    const { temaSeleccionado } = useTemaSeleccionado();
    const [subtemas, setSubtemas] = useState([]);

    useEffect(() => {
        if (temaSeleccionado) {
            obtenerSubtemasPorTema(temaSeleccionado.id);
        }
    }, [temaSeleccionado]);

    const obtenerSubtemasPorTema = (idTema) => {
        axios
            .post("http://localhost:5000/subtemas/listarSubtemas", {
                idTema,
                mensaje: "subtemasActivos",
            })
            .then((response) => {
                if (response.data.en === 1) {
                    setSubtemas(response.data.subtemas);
                } else {
                    console.log("Hubo un problema al cargar los subtemas");
                }
            })
            .catch((error) => {
                console.error("Error al obtener los subtemas:", error);
            });
    };

    if (!temaSeleccionado) {
        return (
            <Container>
                <Row>
                    <Col className="text-center">
                        <h1>Selecciona un tema para ver el contenido</h1>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            <Row>
                <Col>
                    <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.titulo }} />
                    <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.objetivos }} />
                    <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.descripcion }} />
                    <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.recursos }} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Subtemas:</h2>
                    {subtemas.length > 0 ? (
                        <div>
                            {subtemas.map((subtema) => (
                                <div key={subtema.id}>
                                    <div dangerouslySetInnerHTML={{ __html: subtema.titulo }} />
                                    <div dangerouslySetInnerHTML={{ __html: subtema.objetivos }} />
                                    <div dangerouslySetInnerHTML={{ __html: subtema.descripcion }} />
                                    <Editor
                                        height="200px"
                                        defaultLanguage="c"
                                        value={subtema.ejemploCodigo}
                                    />
                                    <div dangerouslySetInnerHTML={{ __html: subtema.recursos }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No hay subtemas disponibles.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default MostrarContenido;