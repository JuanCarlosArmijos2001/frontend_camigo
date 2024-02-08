import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import axios from "axios";

const ModalEditarUsuario = ({ show, onHide }) => {
    const { usuarioDetalles, setUsuarioDetalles } = useSesionUsuario();
    const [nuevosDatos, setNuevosDatos] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        nuevaClave: "",
        confirmarClave: "",
    });
    
    const [errorClave, setErrorClave] = useState(null);

    useEffect(() => {
        // Cargar datos actuales del usuario al abrir el modal
        if (usuarioDetalles) {
            setNuevosDatos({
                nombres: usuarioDetalles.detallesPersona.nombres,
                apellidos: usuarioDetalles.detallesPersona.apellidos,
                email: usuarioDetalles.detallesCuenta.email,
                nuevaClave: "",
                confirmarClave: "",
            });
        }
    }, [show, usuarioDetalles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevosDatos((prevDatos) => ({ ...prevDatos, [name]: value }));
        console.log("Nuevos datos usuario", nuevosDatos);
    };

    const handleGuardarCambios = async () => {
        console.log("usuario contexto:", usuarioDetalles.detallesPersona);
        console.log("usuario nuevo:", nuevosDatos);

        if (nuevosDatos.nuevaClave !== nuevosDatos.confirmarClave) {
            setErrorClave("Las nuevas claves no coinciden");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/sesionUsuario/editarUsuario",
                {
                    userId: usuarioDetalles.id,
                    nombres: nuevosDatos.nombres,
                    apellidos: nuevosDatos.apellidos,
                    email: nuevosDatos.email,
                    clave: nuevosDatos.nuevaClave,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        version: "1.0.0",
                    },
                }
            );

            const { en, m, usuarioEditado } = response.data;

            if (en === 1) {
                console.log("Usuario actualizado exitosamente");
                onHide();
                let usuarioActualizado = { ...usuarioDetalles };
                usuarioActualizado.detallesPersona.nombres = usuarioEditado.nombres;
                usuarioActualizado.detallesPersona.apellidos = usuarioEditado.apellidos;
                usuarioActualizado.detallesPersona.email = usuarioEditado.email;
                usuarioActualizado.detallesPersona.clave = usuarioEditado.clave;
                setUsuarioDetalles(usuarioActualizado);
                // usuarioActualizado.detallesPersona.nombres = nuevosDatos.nombres;
                // window.location.reload();
            } else {
                console.error("Error al actualizar el usuario:", m);
            }
        } catch (error) {
            console.error(
                "Error en la petición para actualizar el usuario:",
                error
            );
        }
    };

    return (
        <Modal show={show} onHide={onHide} style={{ zIndex: 1500 }}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNombres">
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa tus nombres"
                            name="nombres"
                            value={nuevosDatos.nombres}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formApellidos">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa tus apellidos"
                            name="apellidos"
                            value={nuevosDatos.apellidos}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingresa tu email"
                            name="email"
                            value={nuevosDatos.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formNuevaClave">
                        <Form.Label>Nueva Clave</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa tu nueva clave"
                            name="nuevaClave"
                            value={nuevosDatos.nuevaClave}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formConfirmarClave">
                        <Form.Label>Confirmar Clave</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirma tu nueva clave"
                            name="confirmarClave"
                            value={nuevosDatos.confirmarClave}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {errorClave && <p className="text-danger">{errorClave}</p>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="success" onClick={handleGuardarCambios}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEditarUsuario;

//-----------  -------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import { Button, Modal, TextField, Typography, Box } from "@mui/material";
// import { useSesionUsuario } from "../../context/SesionUsuarioContext";
// import axios from "axios";

// const ModalEditarUsuario = ({ show, onHide }) => {
//     const { usuarioDetalles } = useSesionUsuario();
//     const [nuevosDatos, setNuevosDatos] = useState({
//         nombres: "",
//         apellidos: "",
//         email: "",
//         nuevaClave: "",
//         confirmarClave: "",
//     });
//     const [errorClave, setErrorClave] = useState(null);

//     useEffect(() => {
//         // Cargar datos actuales del usuario al abrir el modal
//         if (usuarioDetalles) {
//             console.log("Datos del usuario al abrir el modal:", usuarioDetalles);
//             setNuevosDatos({
//                 nombres: usuarioDetalles.detallesPersona.nombres,
//                 apellidos: usuarioDetalles.detallesPersona.apellidos,
//                 email: usuarioDetalles.detallesCuenta.email,
//                 nuevaClave: "",
//                 confirmarClave: "",
//             });
//         }
//     }, [show, usuarioDetalles]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setNuevosDatos((prevDatos) => ({ ...prevDatos, [name]: value }));
//     };

//     const handleGuardarCambios = async () => {
//         console.log("id del usuario:", usuarioDetalles.id);
//         if (nuevosDatos.nuevaClave !== nuevosDatos.confirmarClave) {
//             setErrorClave("Las nuevas claves no coinciden");
//             return;
//         }

//         try {
//             const response = await axios.post(
//                 "http://localhost:5000/sesionUsuario/editarUsuario",
//                 {
//                     userId: usuarioDetalles.id,
//                     nombres: nuevosDatos.nombres,
//                     apellidos: nuevosDatos.apellidos,
//                     email: nuevosDatos.email,
//                     clave: nuevosDatos.nuevaClave,
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         version: "1.0.0",
//                     },
//                 }
//             );

//             const { en, m } = response.data;

//             if (en === 1) {
//                 console.log("Usuario actualizado exitosamente");
//                 onHide();
//                 window.location.reload();
//             } else {
//                 console.error("Error al actualizar el usuario:", m);
//             }
//         } catch (error) {
//             console.error(
//                 "Error en la petición para actualizar el usuario:",
//                 error
//             );
//         }
//     };

//     return (
//         <Modal open={show} onClose={onHide}>
//             <Box sx={style}>
//                 <Typography variant="h6" component="div">
//                     Editar Usuario
//                 </Typography>
//                 <form>
//                     <TextField
//                         fullWidth
//                         label="Nombres"
//                         placeholder="Ingresa tus nombres"
//                         name="nombres"
//                         value={nuevosDatos.nombres}
//                         onChange={handleChange}
//                         margin="normal"
//                     />
//                     <TextField
//                         fullWidth
//                         label="Apellidos"
//                         placeholder="Ingresa tus apellidos"
//                         name="apellidos"
//                         value={nuevosDatos.apellidos}
//                         onChange={handleChange}
//                         margin="normal"
//                     />
//                     <TextField
//                         fullWidth
//                         label="Email"
//                         type="email"
//                         placeholder="Ingresa tu email"
//                         name="email"
//                         value={nuevosDatos.email}
//                         onChange={handleChange}
//                         margin="normal"
//                     />
//                     <TextField
//                         fullWidth
//                         label="Nueva Clave"
//                         type="password"
//                         placeholder="Ingresa tu nueva clave"
//                         name="nuevaClave"
//                         value={nuevosDatos.nuevaClave}
//                         onChange={handleChange}
//                         margin="normal"
//                     />
//                     <TextField
//                         fullWidth
//                         label="Confirmar Clave"
//                         type="password"
//                         placeholder="Confirma tu nueva clave"
//                         name="confirmarClave"
//                         value={nuevosDatos.confirmarClave}
//                         onChange={handleChange}
//                         margin="normal"
//                     />
//                     {errorClave && (
//                         <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
//                             {errorClave}
//                         </Typography>
//                     )}
//                     <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
//                         <Button
//                             variant="contained"
//                             color="error"
//                             sx={{ backgroundColor: 'red' }}
//                             onClick={onHide}
//                         >
//                             Cerrar
//                         </Button>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={handleGuardarCambios}
//                             sx={{ marginLeft: 2 }}
//                         >
//                             Guardar
//                         </Button>
//                     </Box>
//                 </form>
//             </Box>
//         </Modal>
//     );
// };

// export default ModalEditarUsuario;

// const style = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: 400,
//     bgcolor: "background.paper",
//     border: "2px solid #000",
//     boxShadow: 24,
//     p: 4,
// };