import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "../../../assets/styles/components/main/temas/gestionarTemas.css";
import Cargando from "../../utilities/Cargando";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import ModalRegistrarPregunta from "./ModalRegistrarPregunta";
import ModalEditarPregunta from "./ModalEditarPregunta";
import Card from 'react-bootstrap/Card';
import Imagen from '../../../assets/images/crear.svg';

const GestionarPreguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();
    const { preguntaSeleccionado, actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
    const [term, setTerm] = useState('');
    const [existePreguntas, setExistePreguntas] = useState(false);

    useEffect(() => {
        cargarPreguntas();
    }, [ejercicioSeleccionado]);


    const cargarPreguntas = () => {
        axios
            .post("http://localhost:5000/preguntas/listarPreguntas", {
                idEjercicio: ejercicioSeleccionado.id,
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

    const activarDesactivarEjercicio = () => {
        if (preguntaSeleccionado) {
            const nuevoEstado = preguntaSeleccionado.estado === 1 ? -1 : 1;
            axios
                .post("http://localhost:5000/preguntas/activarDesactivarPregunta", {
                    id: preguntaSeleccionado.id,
                    estado: nuevoEstado,
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        cargarPreguntas();
                    } else {
                        console.log("No se pudo cambiar el estado de la pregunta");
                    }
                })
                .catch((error) => {
                    console.error("Error al cambiar el estado de la pregunta:", error);
                });
        }
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const getButtonText = () => {
        if (preguntaSeleccionado === null) {
            return preguntas[0].estado === 1 ? "Desactivar" : "Activar";
        } else if (preguntaSeleccionado.estado === 1) {
            return "Desactivar";
        } else {
            return "Activar";
        }
    };

    const filteredPreguntas = term
        ? preguntas.filter(pregunta =>
            pregunta.enunciado.toLowerCase().includes(term.toLowerCase())
        )
        : preguntas;


    return (
        <div>
            {existePreguntas ? (
                preguntas.length > 0 ? (
                    <div className="contenedorPrincipal">
                        <div className="informacionTema">
                            <h1>Preguntas de control</h1>
                            <p>Los preguntas con fondo color rojo están desactivadas</p>
                            <p>Es necesario seleccionar una pregunta de control para editar o para activar/desactivar.</p>

                        </div>
                        <div className="contenedorTabla">
                            <Form.Group controlId="formBuscar">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar pregunta"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <table className="tablaTemas">
                                <thead>
                                    <tr>
                                        <th className="tituloTabla">Preguntas de control existentes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPreguntas.map((pregunta, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => actualizarPreguntaSeleccionado(pregunta)}
                                            className={`
                ${pregunta.estado === -1 ? "redRow" : ""}
                ${preguntaSeleccionado && preguntaSeleccionado.id === pregunta.id
                                                    ? "selectedRow"
                                                    : ""
                                                }
              `}
                                        >
                                            <td>{cleanHtmlTags(pregunta.enunciado)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="botonesDerecha">
                            <ModalRegistrarPregunta cargarPreguntas={cargarPreguntas} preguntas={preguntas} />
                            <ModalEditarPregunta
                                cargarPreguntas={cargarPreguntas}
                                preguntaParaEditar={preguntaSeleccionado}
                            />
                            <Button
                                variant="danger"
                                className="botonActivarDesactivarTema"
                                disabled={!preguntaSeleccionado}
                                onClick={activarDesactivarEjercicio}
                            >
                                {getButtonText()}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Cargando />
                )
            ) : (
                <Card style={{ width: '18rem', marginTop: '75px', marginLeft: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Card.Img variant="top" src={Imagen} />
                    <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Card.Title>Sé pionero: Haz de este ejercicio un espacio lleno de preguntas de control interesantes.</Card.Title>
                        <Card.Text style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <ModalRegistrarPregunta cargarPreguntas={cargarPreguntas} preguntas={preguntas} />
                        </Card.Text>
                    </Card.Body>
                </Card>
            )
            }
        </div>
    );
};

export default GestionarPreguntas;