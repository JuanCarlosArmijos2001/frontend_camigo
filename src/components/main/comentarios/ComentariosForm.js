import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Col, Row, Container } from "react-bootstrap";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import axios from 'axios';

const ComentariosForm = () => {
    const { token, usuarioDetalles } = useSesionUsuario();
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();

    const [contenido, setContenido] = useState("");
    const [error, setError] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [comentarioEditable, setComentarioEditable] = useState(null);

    useEffect(() => {
        // Cargar los comentarios del servidor para el ejercicio seleccionado
        cargarComentarios();
    }, [ejercicioSeleccionado]);

    const cargarComentarios = async () => {
        try {
            // Solo cargar comentarios si hay un ejercicio seleccionado
            if (ejercicioSeleccionado) {
                const response = await axios.post("http://localhost:5000/comentarios/listarComentarios", {
                    idEjercicio: ejercicioSeleccionado.id,
                });
                setComentarios(response.data.comentarios);
            }
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
        }
    };

    const limpiarFormulario = () => {
        setContenido("");
        setComentarioEditable(null);
    };

    const handleComentarioSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setError("Debes iniciar sesión para agregar un comentario.");
            return;
        }

        setError(null);

        if (contenido.trim() === "") {
            setError("Por favor, ingrese el contenido del comentario.");
            return;
        }

        try {
            if (comentarioEditable) {
                // Si hay un comentarioEditable, realizar la edición
                await axios.post("http://localhost:5000/comentarios/editarComentario", {
                    id: comentarioEditable.id,
                    nombreUsuario: usuarioDetalles.detallesPersona.nombres,
                    contenido,
                });
                // Limpiar el formulario después de la edición
                limpiarFormulario();
            } else {
                // Si no hay comentarioEditable, realizar el registro de un nuevo comentario
                await axios.post("http://localhost:5000/comentarios/registrarComentario", {
                    nombreUsuario: usuarioDetalles.detallesPersona.nombres,
                    contenido,
                    idEjercicio: ejercicioSeleccionado.id,
                });
                // Limpiar el formulario después del registro
                limpiarFormulario();
            }
            // Volver a cargar los comentarios después de registrar/editar
            cargarComentarios();
        } catch (error) {
            console.error("Error al procesar el comentario:", error);
            setError("Hubo un error al procesar el comentario. Por favor, inténtelo de nuevo.");
        }
    };

    const handleEditarComentario = (comentario) => {
        // Setear el comentarioEditable cuando se hace clic en el botón de editar
        setComentarioEditable(comentario);
        setContenido(comentario.contenido);
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    {token && (
                        <Form onSubmit={handleComentarioSubmit}>
                            <p>¿Tienes dudas en este ejercicio {usuarioDetalles.detallesPersona.nombres}?, coméntalas:</p>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group controlId="formContenido">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder={`Ingrese su comentario ${usuarioDetalles.detallesPersona.nombres}`}
                                    value={contenido}
                                    onChange={(e) => setContenido(e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <Button variant="primary" type="submit">
                                {comentarioEditable ? "Editar Comentario" : "Agregar Comentario"}
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
            {/* Listar los comentarios debajo del formulario */}
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2>Comentarios:</h2>
                    {comentarios.map((comentario) => (
                        <div key={comentario.id}>
                            <strong>{comentario.nombreUsuario}</strong>: {comentario.contenido}
                            {token && comentario.nombreUsuario === usuarioDetalles.detallesPersona.nombres && (
                                // Mostrar el botón de editar solo si el comentario es del usuario en sesión
                                <Button variant="link" onClick={() => handleEditarComentario(comentario)}>
                                    Editar
                                </Button>
                            )}
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default ComentariosForm;
