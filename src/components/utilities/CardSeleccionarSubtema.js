import Card from 'react-bootstrap/Card';
import Imagen from '../../assets/images/peligro.svg';

function CardSeleccionarSubtema() {
  return (
    <Card style={{ maxWidth: '300px', margin: "70px" }}>
      <Card.Img variant="top" src={Imagen} />
      <Card.Body className="text-center">
        <Card.Title style={{ textAlign: 'justify' }}>Explora tu interés: Selecciona un subtema.</Card.Title>
        <Card.Text style={{ textAlign: 'justify' }}>
          Para descubrir los ejercicios disponibles, por favor, selecciona un subtema. ¡Estamos emocionados por mostrarte el contenido relacionado con tu elección!
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardSeleccionarSubtema;