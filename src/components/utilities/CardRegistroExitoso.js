import Card from 'react-bootstrap/Card';
import Imagen from '../../assets/images/registro.svg';

function CardRegistroExitoso() {
  return (
    <Card style={{ width: '25rem', marginLeft: '2em'}}>
      <Card.Img variant="top" src={Imagen} />
      <Card.Body>
        <Card.Title>¡Registro Exitoso en Camigo!</Card.Title>
        <Card.Text>
          ¡Enhorabuena! Has completado con éxito el registro en Camigo, tu compañero de aprendizaje en el mundo de la programación en C. Ahora estás listo para explorar un viaje educativo emocionante y sumergirte en el fascinante mundo del lenguaje de programación C. ¡Bienvenido a la comunidad Camigo, donde el aprendizaje se convierte en una experiencia colaborativa y divertida!
          No dudes en explorar los recursos de aprendizaje, participar en desafíos de programación y conectarte con otros entusiastas de la programación. Estamos aquí para apoyarte en cada paso de tu viaje hacia la maestría en C.
          ¡Feliz programación y bienvenido a Camigo!.
          <strong> Inicia sesión para comenzar tu viaje de aprendizaje 🚀👩‍💻👨‍💻.</strong>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardRegistroExitoso;