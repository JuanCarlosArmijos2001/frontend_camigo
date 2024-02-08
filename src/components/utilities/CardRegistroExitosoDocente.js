import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import IniciarSesion from '../administrarSesion/IniciarSesion';
import Imagen from '../../assets/images/registro.svg';

function CardRegistroExitosoDocente() {

  return (
    <>
      <Card style={{ width: '25rem', marginLeft: '2em' }}>
        <Card.Img variant="top" src={Imagen} />
        <Card.Body>
          <Card.Title>¡Registro Exitoso en Camigo!</Card.Title>
          <Card.Text>
            <strong> Usuario tipo docente creado con éxito 🚀👩‍💻👨‍💻.</strong>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default CardRegistroExitosoDocente;
