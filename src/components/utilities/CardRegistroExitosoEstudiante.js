// import React from 'react';
// import Card from 'react-bootstrap/Card';
// import Imagen from '../../assets/images/registro.svg';

// function CardRegistroExitosoEstudiante() {

//   return (
//     <>
//         <Card style={{ width: '25rem', marginLeft: '2em' }}>
//           <Card.Header closeButton style={{ display: 'flex', justifyContent: 'flex-end' }}>
//             <button type="button" className="btn-close" aria-label="Close"></button>
//           </Card.Header>
//           <Card.Img variant="top" src={Imagen} />
//           <Card.Body>
//             <Card.Title>¡Registro Exitoso en Camigo!</Card.Title>
//             <Card.Text>
//               ¡Enhorabuena! Has completado con éxito el registro en Camigo, tu compañero de aprendizaje en el mundo de la programación en C. Ahora estás listo para explorar un viaje educativo emocionante y sumergirte en el fascinante mundo del lenguaje de programación C. ¡Bienvenido a la comunidad Camigo, donde el aprendizaje se convierte en una experiencia colaborativa y divertida! No dudes en explorar los recursos de aprendizaje, participar en desafíos de programación y conectarte con otros entusiastas de la programación. Estamos aquí para apoyarte en cada paso de tu viaje hacia la maestría en C. ¡Feliz programación y bienvenido a Camigo!.
//               <strong> Inicia sesión para comenzar tu viaje de aprendizaje 🚀👩‍💻👨‍💻.</strong>
//             </Card.Text>
//           </Card.Body>
//         </Card>
//     </>
//   );
// }

// export default CardRegistroExitosoEstudiante;

//---------------------------------------------------------------------------------------------------
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Imagen from '../../assets/images/registro.svg';
// import IniciarSesion from '../administrarSesion/IniciarSesion';

function CardRegistroExitosoEstudiante() {
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>¡Registro Exitoso en Camigo!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={Imagen} alt="Registro Exitoso" style={{ width: '100%' }} />
          <p>
            ¡Enhorabuena! Has completado con éxito el registro en Camigo, tu compañero de aprendizaje en el mundo de la programación en C. Ahora estás listo para explorar un viaje educativo emocionante y sumergirte en el fascinante mundo del lenguaje de programación C. ¡Bienvenido a la comunidad Camigo, donde el aprendizaje se convierte en una experiencia colaborativa y divertida! No dudes en explorar los recursos de aprendizaje, participar en desafíos de programación y conectarte con otros entusiastas de la programación. Estamos aquí para apoyarte en cada paso de tu viaje hacia la maestría en C. ¡Feliz programación y bienvenido a Camigo!.
            <strong> Inicia sesión para comenzar tu viaje de aprendizaje 🚀👩‍💻👨‍💻.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CardRegistroExitosoEstudiante;

