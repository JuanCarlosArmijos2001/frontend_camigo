import Card from 'react-bootstrap/Card';
import Imagen from '../../assets/images/peligro.svg';

function CardSeleccionarEjercicio() {
  return (
    <Card style={{ width: '18rem', marginTop: '20px', marginLeft: '150px' }}>
      <Card.Img variant="top" src={Imagen} />
      <Card.Body>
        <Card.Title>Explora tu interés: Selecciona un ejercicio.</Card.Title>
        <Card.Text>
        Para descubrir las preguntas de control disponibles, por favor, selecciona un ejercicio. ¡Estamos emocionados por mostrarte el contenido relacionado con tu elección!
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardSeleccionarEjercicio;