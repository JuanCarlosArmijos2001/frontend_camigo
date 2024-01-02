// import React, { useState } from 'react';
// import { Button, Form, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import { useSesionUsuario } from '../../context/SesionUsuarioContext';
// import '../../assets/styles/components/administrarSesion/ModalAdministrarSesion.css';

// const IniciarSesion = ({ handleClose }) => {
//     const [email, setEmail] = useState('');
//     const [clave, setClave] = useState('');
//     const { iniciarSesion } = useSesionUsuario();
//     const [error, setError] = useState(null);


//     const handleIniciarSesion = async () => {

//         if (!email || !clave) {
//             setError('Por favor, complete todos los campos.');
//             return;
//         }

//         if (!validarFormatoEmail(email)) {
//             setError('Ingrese un correo electrónico válido.');
//             return;
//         }

//         try {
//             const response = await axios.post(
//                 'http://localhost:5000/sesionUsuario/autenticacion',
//                 {
//                     email,
//                     clave,
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         version: '1.0.0',
//                     },
//                 }
//             );

//             const { en, m, usuario: resultadoUsuario } = response.data;

//             if (en === 1) {
//                 iniciarSesion(resultadoUsuario);
//                 handleClose();
//                 console.log('Sesión iniciada correctamente');
//             } else {
//                 setError(m);
//                 console.error('Error en autenticación:', m);

//             }
//         } catch (error) {
//             setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
//             console.error('Error en la petición de autenticación:', error);
//         }
//     };

//     const handleAlertClose = () => {
//         setError(null);
//     };

//     //controles
//     const validarFormatoEmail = (correo) => {
//         const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return regexEmail.test(correo);
//     };

//     return (
//         <Form>
//             {error && (
//                 <Alert variant="danger" dismissible onClose={handleAlertClose}>
//                     {error}
//                 </Alert>
//             )}
//             <Form.Group id="formBasicEmail">
//                 <Form.Label>Email:</Form.Label>
//                 <Form.Control
//                     type="email"
//                     placeholder="Ingrese su email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//             </Form.Group>

//             <Form.Group id="formBasicPassword">
//                 <Form.Label>Contraseña:</Form.Label>
//                 <Form.Control
//                     type="password"
//                     placeholder="Ingrese su contraseña"
//                     value={clave}
//                     onChange={(e) => setClave(e.target.value)}
//                 />
//             </Form.Group>

//             <Button id="btnFormIniciarSesion" variant="success" onClick={handleIniciarSesion}>
//                 Iniciar Sesión
//             </Button>
//         </Form>
//     );
// };

// export default IniciarSesion;

import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useSesionUsuario } from '../../context/SesionUsuarioContext';
import '../../assets/styles/components/administrarSesion/ModalAdministrarSesion.css';

const IniciarSesion = ({ handleClose }) => {
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const { iniciarSesion } = useSesionUsuario(); // Utiliza el nuevo contexto
    const [error, setError] = useState(null);

    const handleIniciarSesion = async () => {
        if (!email || !clave) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        if (!validarFormatoEmail(email)) {
            setError('Ingrese un correo electrónico válido.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/sesionUsuario/autenticacion',
                {
                    email,
                    clave,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        version: '1.0.0',
                    },
                }
            );

            console.log('Respuesta desde el backend:', response.data); // Agrega esta línea

            const { en, m, usuario: resultadoUsuario, externalId } = response.data;

            if (en === 1) {
                iniciarSesion({ ...resultadoUsuario, externalId });
                handleClose();
                console.log('Sesión iniciada correctamente');
            } else {
                setError(m);
                console.error('Error en autenticación:', m);
            }
        } catch (error) {
            setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
            console.error('Error en la petición de autenticación:', error);
        }
    };

    const handleAlertClose = () => {
        setError(null);
    };

    //controles
    const validarFormatoEmail = (correo) => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(correo);
    };

    return (
        <Form>
            {error && (
                <Alert variant="danger" dismissible onClose={handleAlertClose}>
                    {error}
                </Alert>
            )}
            <Form.Group id="formBasicEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Ingrese su email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group id="formBasicPassword">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                />
            </Form.Group>

            <Button id="btnFormIniciarSesion" variant="success" onClick={handleIniciarSesion}>
                Iniciar Sesión
            </Button>
        </Form>
    );
};

export default IniciarSesion;
