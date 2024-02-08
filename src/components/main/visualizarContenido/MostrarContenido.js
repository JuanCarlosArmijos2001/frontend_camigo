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
import ProgressBar from 'react-bootstrap/ProgressBar';

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
            cargarEjercicios();
        }
    }, [subtemaSeleccionado]);

    useEffect(() => {
        if (ejercicioSeleccionado) {
            cargarPreguntas();
        }
    }, [ejercicioSeleccionado]);

    const cargarEjercicios = () => {
        axios
            .post("http://localhost:5000/ejercicios/listarEjercicios", {
                idSubtema: subtemaSeleccionado.idSubtema,
                idUsuario: usuarioDetalles.id,
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

    const cargarPreguntas = () => {
        axios
            .post("http://localhost:5000/preguntas/listarPreguntas", {
                idEjercicio: ejercicioSeleccionado.idEjercicio,
                idUsuario: usuarioDetalles.id,
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
                    idPregunta: preguntaSeleccionado.idPregunta,
                    idEjercicio: ejercicioSeleccionado.idEjercicio,
                    idSubtema: subtemaSeleccionado.idSubtema,
                    idTema: temaSeleccionado.idTema,
                    idUsuario: usuarioDetalles.id,
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
        <div className="content-wrapper">
            <Container>
                <Row>
                    <Col>
                        {temaSeleccionado && (
                            <>
                                <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.titulo }} />
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.objetivos }} style={{textAlign: 'justify'}} />
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.descripcion }} style={{textAlign: 'justify'}} />
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: temaSeleccionado.recursos }} style={{textAlign: 'justify'}} />
                                <br />
                            </>
                        )}
                    </Col>
                </Row>
                {subtemaSeleccionado && (
                    <Row ref={subtemaSectionRef}>
                        <Col>
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: subtemaSeleccionado.titulo }} />
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: subtemaSeleccionado.objetivos }} style={{textAlign: 'justify'}}/>
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: subtemaSeleccionado.descripcion }} style={{textAlign: 'justify'}}/>
                                <br />
                                <Editor height="300px" defaultLanguage="c" value={subtemaSeleccionado.ejemploCodigo} />
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: subtemaSeleccionado.recursos }} style={{textAlign: 'justify'}}/>
                                <br />
                            </div>
                        </Col>
                    </Row>
                )}

                {existeEjercicios && subtemaSeleccionado && (
                    <>
                        <Row>
                            <Col>
                                {ejercicios.map((ejercicio) => (
                                    <div key={ejercicio.idEjercicio} className="mb-3">
                                        <Button
                                            value={ejercicio.idEjercicio}
                                            onClick={() => {
                                                actualizarEjercicioSeleccionado(ejercicio);
                                                actualizarPreguntaSeleccionado(null);
                                                setMostrarSolucion(false);
                                                setSelectedOption(null);
                                                setShowExplanation(false);
                                            }}
                                            className="mb-2 w-100"
                                            variant="outline-success"
                                        >
                                            {cleanHtmlTags(ejercicio.titulo)}
                                        </Button>
                                        {ejercicio.progreso !== undefined && (
                                            <ProgressBar className="mb-2" variant="success">
                                                <ProgressBar
                                                    now={ejercicio.progreso}
                                                    label={`${ejercicio.progreso}%`}
                                                />
                                            </ProgressBar>
                                        )}
                                    </div>
                                ))}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <br />
                                {ejercicioSeleccionado && (
                                    <div>
                                        <div dangerouslySetInnerHTML={{ __html: ejercicioSeleccionado.titulo }} />
                                        <br />
                                        <div dangerouslySetInnerHTML={{ __html: ejercicioSeleccionado.instrucciones }} style={{textAlign: 'justify'}}/>
                                        <br />
                                        <div dangerouslySetInnerHTML={{ __html: ejercicioSeleccionado.restricciones }} style={{textAlign: 'justify'}}/>
                                        <br />
                                        <p>Realiza tu solución</p>
                                        <EditorCompilador />
                                        <br />
                                        <Button variant="success" onClick={() => setMostrarSolucion(!mostrarSolucion)}>
                                            {mostrarSolucion ? "Ocultar solución" : "Mostrar solución"}
                                        </Button>
                                        <br />
                                        {mostrarSolucion && (
                                            <>
                                                <br />
                                                <Editor height="300px" defaultLanguage="c" value={ejercicioSeleccionado.solucion} />
                                                <br />
                                            </>
                                        )}
                                        <br />
                                    </div>
                                )}
                            </Col>
                        </Row>
                        
                        {existePreguntas && ejercicioSeleccionado && (
                            <Row>
                                <Col>
                                    {preguntas.map((pregunta) => (
                                        <Button
                                            key={pregunta.idPregunta}
                                            onClick={() => {
                                                actualizarPreguntaSeleccionado(pregunta);
                                                setMostrarSolucion(false);
                                                setSelectedOption(null);
                                                setShowExplanation(false);
                                            }}
                                            className="mb-2 w-100"
                                            variant="outline-success"
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
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: preguntaSeleccionado.enunciado }} style={{textAlign: 'justify'}}/>
                                <br />
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
                                                <br />
                                                <p>Excelente, respuesta la opción seleccionada es la correcta</p>
                                                <br />
                                                <div dangerouslySetInnerHTML={{ __html: preguntaSeleccionado.justificacion }} />
                                            </>
                                        ) : (
                                            <>
                                                <p>Oh, tu respuesta es incorrecta, inténtalo de nuevo.</p>
                                                <Button variant="success" onClick={volverAIntentarlo}>
                                                    Volver a intentarlo
                                                </Button>
                                                <br />
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
        </div>
    );
};

export default MostrarContenido;