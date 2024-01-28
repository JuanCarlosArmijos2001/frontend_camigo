import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import axios from 'axios';
import ComentariosForm from "../comentarios/ComentariosForm";
import EditorCompilador from "./EditorCompilador";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";

const MostrarContenido = () => {
    const { temaSeleccionado } = useTemaSeleccionado();
    const { subtemaSeleccionado } = useSubtemaSeleccionado();
    const { ejercicioSeleccionado, actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
    const { preguntaSeleccionado, actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();
    const subtemaSectionRef = useRef(null);
    const [ejercicios, setEjercicios] = useState([]);
    const [existeEjercicios, setExisteEjercicios] = useState(false);
    const [mostrarSolucion, setMostrarSolucion] = useState(false);
    const [preguntas, setPreguntas] = useState([]);
    const [existePreguntas, setExistePreguntas] = useState(false);
    const [intentoFallido, setIntentoFallido] = useState(false);


    useEffect(() => {
        if (subtemaSeleccionado) {
            cargarEjercicios(subtemaSeleccionado.id);
        }
    }, [subtemaSeleccionado]);

    useEffect(() => {
        if (ejercicioSeleccionado) {
            cargarPreguntas(ejercicioSeleccionado.id);
        }
    }, [ejercicioSeleccionado]);

    const cargarEjercicios = (idSubtema) => {
        axios
            .post("http://localhost:5000/ejercicios/listarEjercicios", {
                idSubtema,
                mensaje: "ejerciciosActivos",
            })
            .then((response) => {
                if (response.data.en === 1) {
                    setEjercicios(response.data.ejercicios);
                    setExisteEjercicios(true);
                } else {
                    console.log("Hubo un problema al cargar los ejercicios");
                    setExisteEjercicios(false);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los ejercicios:", error);
            });
    };

    const cargarPreguntas = (idEjercicio) => {
        axios
            .post("http://localhost:5000/preguntas/listarPreguntas", {
                idEjercicio,
                mensaje: "preguntasActivas",
            })
            .then((response) => {
                if (response.data.en === 1) {
                    setPreguntas(response.data.preguntas);
                    setExistePreguntas(true);
                } else {
                    console.log("Hubo un problema al cargar las preguntas");
                    setExistePreguntas(false);
                }
            })
            .catch((error) => {
                console.error("Error al obtener las preguntas:", error);
            });
    };

    useEffect(() => {
        if (subtemaSectionRef.current) {
            subtemaSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [subtemaSeleccionado]);

    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleOptionChange = async (option) => {
        console.log("Opción seleccionada:", option);
        setSelectedOption(option);
        setShowExplanation(true);
        
        const isOptionCorrect = option === preguntaSeleccionado.respuesta_correcta;
        setIsCorrect(isOptionCorrect);
        console.log("Respuesta correcta: ", preguntaSeleccionado.respuesta_correcta);

        if (isOptionCorrect) {
            console.log("Pregunta completada entro a la funcion")
            try {
                const response = await axios.post("http://localhost:5000/preguntas/completarPregunta", {
                    idPregunta: preguntaSeleccionado.id,
                    idEjercicio: ejercicioSeleccionado.id,
                    idSubtema: subtemaSeleccionado.id,
                    idTema: temaSeleccionado.id,
                    idUsuario: usuarioDetalles.id
                });
                console.log(response.data);
            } catch (error) {
                console.error("Error al completar la pregunta:", error);
            }
        } else {
            setIntentoFallido(true);
        }
    };

    const volverAIntentarlo = () => {
        setIntentoFallido(false);
        setShowExplanation(false);
        setSelectedOption(null);
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };


    return (
        <Container>
            <Row>
                <Col>
                    {temaSeleccionado && (
                        <>
                            <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.titulo }} />
                            <br />
                            <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.objetivos }} />
                            <br />
                            <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.descripcion }} />
                            <br />
                            <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.recursos }} />
                            <br />
                        </>
                    )}
                </Col>
            </Row>
            {subtemaSeleccionado && (
                <Row ref={subtemaSectionRef}>
                    <Col>
                        <h2>Subtema:</h2>
                        <div>
                            <div dangerouslySetInnerHTML={{ __html: subtemaSeleccionado.titulo }} />
                            <br />
                            <div dangerouslySetInnerHTML={{ __html: subtemaSeleccionado.objetivos }} />
                            <br />
                            <div dangerouslySetInnerHTML={{ __html: subtemaSeleccionado.descripcion }} />
                            <br />
                            <Editor height="200px" defaultLanguage="c" value={subtemaSeleccionado.ejemploCodigo} />
                            <br />
                            <div dangerouslySetInnerHTML={{ __html: subtemaSeleccionado.recursos }} />
                            <br />
                        </div>
                    </Col>
                </Row>
            )}
            {existeEjercicios && (
                <>
                    <Row>
                        <Col>
                            <h2>Selecciona un ejercicio:</h2>
                            {ejercicios.map((ejercicio) => (
                                <Button
                                    key={ejercicio.id}
                                    value={ejercicio.id}
                                    onClick={() => {
                                        actualizarEjercicioSeleccionado(ejercicio);
                                        actualizarPreguntaSeleccionado(null);
                                        setMostrarSolucion(false);
                                        setSelectedOption(null);
                                        setShowExplanation(false);
                                    }}
                                    className="mb-2"
                                    variant="outline-primary"
                                >
                                    {cleanHtmlTags(ejercicio.titulo)}
                                </Button>
                            ))}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Contenido del ejercicio:</h2>
                            {ejercicioSeleccionado && (
                                <div>
                                    <div dangerouslySetInnerHTML={{ __html: ejercicioSeleccionado.titulo }} />
                                    <br />
                                    <div dangerouslySetInnerHTML={{ __html: ejercicioSeleccionado.instrucciones }} />
                                    <br />
                                    <div dangerouslySetInnerHTML={{ __html: ejercicioSeleccionado.restricciones }} />
                                    <br />
                                    <p>Realiza tu solución</p>
                                    <EditorCompilador />
                                    <br />
                                    <Button onClick={() => setMostrarSolucion(!mostrarSolucion)}>
                                        {mostrarSolucion ? "Ocultar solución" : "Mostrar solución"}
                                    </Button>
                                    <br />
                                    {mostrarSolucion && (
                                        <>
                                            <Editor height="200px" defaultLanguage="c" value={ejercicioSeleccionado.solucion} />
                                            <br />
                                        </>
                                    )}
                                </div>
                            )}
                        </Col>
                    </Row>
                    {existePreguntas && (
                        <Row>
                            <Col>
                                <h2>Preguntas asociadas al ejercicio:</h2>
                                {preguntas.map((pregunta) => (
                                    <Button
                                        key={pregunta.id}
                                        onClick={() => {
                                            actualizarPreguntaSeleccionado(pregunta);
                                            setMostrarSolucion(false);
                                            setSelectedOption(null);
                                            setShowExplanation(false);
                                        }}
                                        className="mb-2"
                                        variant="outline-primary"
                                    >
                                        {cleanHtmlTags(pregunta.enunciado)}
                                    </Button>
                                ))}
                            </Col>
                        </Row>
                    )}
                </>
            )}
            {preguntaSeleccionado && (
                <>
                    <Row>
                        <Col>
                            <h2>Contenido de la pregunta:</h2>
                            <div dangerouslySetInnerHTML={{ __html: preguntaSeleccionado.enunciado }} />
                            <Form>
                                {['a', 'b', 'c', 'd'].map((option) => (
                                    <Form.Check
                                        key={option}
                                        type="radio"
                                        id={`option-${option}`}
                                        label={cleanHtmlTags(preguntaSeleccionado[`opcion_${option.toLowerCase()}`])}
                                        onChange={() => handleOptionChange(option)}
                                        checked={selectedOption === option}
                                        disabled={showExplanation || selectedOption !== null}
                                    />
                                ))}
                            </Form>
                            {showExplanation && (
                                <>
                                    {isCorrect ? (
                                        <>
                                            <p>Excelente, respuesta la opción seleccionada es la correcta</p>
                                            <h2>Justificación</h2>
                                            <div dangerouslySetInnerHTML={{ __html: preguntaSeleccionado.justificacion }} />
                                        </>
                                    ) : (
                                        <>
                                            <p>Oh, tu respuesta es incorrecta de la opción, la opción correcta es la opción {preguntaSeleccionado.respuesta_correcta}.</p>
                                            <Button onClick={volverAIntentarlo}>
                                                Volver a intentarlo
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}
                            <br />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ComentariosForm />
                        </Col>
                    </Row>
                    <br />
                </>

            )}
        </Container>
    );
};

export default MostrarContenido;