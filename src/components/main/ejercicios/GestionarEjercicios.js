import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "../../../assets/styles/components/main/temas/gestionarTemas.css";
import Cargando from "../../utilities/Cargando";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import ModalRegistrarEjercicio from "./ModalRegistrarEjercicio";
import ModalEditarEjercicio from "./ModalEditarEjercicio";
import Card from 'react-bootstrap/Card';
import Imagen from '../../../assets/images/crear.svg';

const GestionarEjercicios = () => {
    const [ejercicios, setEjercicios] = useState([]);
    const { subtemaSeleccionado } = useSubtemaSeleccionado();
    const { ejercicioSeleccionado, actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
    const [term, setTerm] = useState('');
    const [existeEjercicios, setExisteEjercicios] = useState(false);

    useEffect(() => {
        cargarEjercicios();
    }, [subtemaSeleccionado]);


    const cargarEjercicios = () => {
        axios
            .post("http://localhost:5000/ejercicios/listarEjercicios", {
                idSubtema: subtemaSeleccionado.id,
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

    const activarDesactivarEjercicio = () => {
        if (ejercicioSeleccionado) {
            const nuevoEstado = ejercicioSeleccionado.estado === 1 ? -1 : 1;
            axios
                .post("http://localhost:5000/ejercicios/activarDesactivarEjercicio", {
                    id: ejercicioSeleccionado.id,
                    estado: nuevoEstado,
                })
                .then((response) => {
                    if (response.data.en === 1) {
                        cargarEjercicios();
                    } else {
                        console.log("No se pudo cambiar el estado del ejercicio");
                    }
                })
                .catch((error) => {
                    console.error("Error al cambiar el estado del ejercicio:", error);
                });
        }
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const getButtonText = () => {
        if (ejercicioSeleccionado === null) {
            return ejercicios[0].estado === 1 ? "Desactivar" : "Activar";
        } else if (ejercicioSeleccionado.estado === 1) {
            return "Desactivar";
        } else {
            return "Activar";
        }
    };

    const filteredEjercicios = term
        ? ejercicios.filter(ejercicio =>
            ejercicio.titulo.toLowerCase().includes(term.toLowerCase())
        )
        : ejercicios;


    return (
        <div>
            {existeEjercicios ? (
                ejercicios.length > 0 ? (
                    <div className="contenedorPrincipal">
                        <div className="informacionTema">
                            <h1>Ejercicios</h1>
                            <p>Los ejercicios con fondo color rojo están desactivados</p>
                            <p>Es necesario seleccionar un ejercicio para editar o para activar/desactivar.</p>
                        </div>
                        <div className="contenedorTabla">
                            <Form.Group controlId="formBuscar">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar ejercicio"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <table className="tablaTemas">
                                <thead>
                                    <tr>
                                        <th className="tituloTabla">Ejercicios existentes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEjercicios.map((ejercicio, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => actualizarEjercicioSeleccionado(ejercicio)}
                                            className={`
                ${ejercicio.estado === -1 ? "redRow" : ""}
                ${ejercicioSeleccionado && ejercicioSeleccionado.id === ejercicio.id
                                                    ? "selectedRow"
                                                    : ""
                                                }
              `}
                                        >
                                            <td>{cleanHtmlTags(ejercicio.titulo)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="botonesDerecha">
                            <ModalRegistrarEjercicio cargarEjercicios={cargarEjercicios} ejercicios={ejercicios} />
                            <ModalEditarEjercicio
                                cargarEjercicios={cargarEjercicios}
                                ejercicioParaEditar={ejercicioSeleccionado}
                            />
                            <Button
                                variant="danger"
                                className="botonActivarDesactivarTema"
                                disabled={!ejercicioSeleccionado}
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
                        <Card.Title>Abre nuevos caminos: Este subtema está esperando tus ejercicios.</Card.Title>
                        <Card.Text style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <ModalRegistrarEjercicio cargarEjercicios={cargarEjercicios} ejercicios={ejercicios} />
                        </Card.Text>
                    </Card.Body>
                </Card>
            )
            }
        </div>

    );
};

export default GestionarEjercicios;