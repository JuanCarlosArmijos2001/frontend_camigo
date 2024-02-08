import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Col, Row, Container } from "react-bootstrap";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const ComentariosForm = () => {
    const { token, usuarioDetalles } = useSesionUsuario();
    const { ejercicioSeleccionado } = useEjercicioSeleccionado();

    const [contenido, setContenido] = useState("");
    const [error, setError] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [comentarioEditable, setComentarioEditable] = useState(null);

    useEffect(() => {
        cargarComentarios();
    }, [ejercicioSeleccionado]);

    const cargarComentarios = async () => {
        try {
            if (ejercicioSeleccionado) {
                const response = await axios.post("http://localhost:5000/comentarios/listarComentarios", {
                    idEjercicio: ejercicioSeleccionado.idEjercicio,
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
                await axios.post("http://localhost:5000/comentarios/editarComentario", {
                    id: comentarioEditable.id,
                    nombreUsuario: usuarioDetalles.detallesPersona.nombres,
                    contenido,
                });
                limpiarFormulario();
            } else {
                await axios.post("http://localhost:5000/comentarios/registrarComentario", {
                    nombreUsuario: usuarioDetalles.detallesPersona.nombres,
                    contenido,
                    idEjercicio: ejercicioSeleccionado.idEjercicio,
                });
                limpiarFormulario();
            }
            cargarComentarios();
        } catch (error) {
            console.error("Error al procesar el comentario:", error);
            setError("Hubo un error al procesar el comentario. Por favor, inténtelo de nuevo.");
        }
    };

    const handleEditarComentario = (comentario) => {
        setComentarioEditable(comentario);
        setContenido(comentario.contenido);
    };

    return (
        <Container>
            <Row>
                <Col md={6}>
                    {token && (
                        <Form onSubmit={handleComentarioSubmit}>
                            <p style={{ whiteSpace: 'nowrap' }}>¿Tienes dudas en este ejercicio {usuarioDetalles.detallesPersona.nombres}?, coméntalas:</p>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group controlId="formContenido">
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder={`Ingrese un nuevo comentario ${usuarioDetalles.detallesPersona.nombres}`}
                                    value={contenido}
                                    onChange={(e) => setContenido(e.target.value)}
                                    style={{ width: '700px' }}
                                />
                            </Form.Group>
                            <br />
                            <Button variant="success" type="submit">
                                {comentarioEditable ? "Editar Comentario" : "Agregar Comentario"}
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
            <Container>
                <Row>
                    <Col md={6} style={{ wordWrap: "break-word", maxWidth: "600px" }}>
                        <br />
                        {comentarios.map((comentario) => (
                            <div key={comentario.id}>
                                <strong>{comentario.nombreUsuario}</strong>: {comentario.contenido}
                                {token && comentario.nombreUsuario === usuarioDetalles.detallesPersona.nombres && (
                                    <span style={{ margin: "10px", cursor: "pointer" }} onClick={() => handleEditarComentario(comentario)}>
                                        <EditIcon />
                                    </span>
                                )}
                            </div>
                        ))}

                    </Col>
                </Row>
            </Container>


        </Container>
    );
};

export default ComentariosForm;
