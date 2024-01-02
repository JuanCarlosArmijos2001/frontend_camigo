import Card from 'react-bootstrap/Card';
import Imagen from '../../assets/images/peligro.svg';

function CardSeleccionarTema() {
  return (
    <Card style={{ width: '18rem', marginTop: '20px', marginLeft: '150px' }}>
      <Card.Img variant="top" src={Imagen} />
      <Card.Body>
        <Card.Title>Explora tu interés: Selecciona un tema.</Card.Title>
        <Card.Text>
        Para descubrir los subtemas disponibles, por favor, selecciona un tema. ¡Estamos emocionados por mostrarte el contenido relacionado con tu elección!
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardSeleccionarTema;