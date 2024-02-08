import React from 'react';
import Card from 'react-bootstrap/Card';
import Imagen from '../../assets/images/peligro.svg';

function CardSeleccionarTema() {
  return (
    <Card style={{maxWidth: '300px', margin: "70px"}}>
      <Card.Img variant="top" src={Imagen} />
      <Card.Body className="text-center">
        <Card.Title style={{ textAlign: 'justify' }}>Explora tu interés: Selecciona un tema.</Card.Title>
        <Card.Text style={{ textAlign: 'justify' }}>
          Para descubrir los subtemas disponibles, por favor, selecciona un tema. ¡Estamos emocionados por mostrarte el contenido relacionado con tu elección!
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardSeleccionarTema;