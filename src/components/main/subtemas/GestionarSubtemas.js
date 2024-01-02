import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "../../../assets/styles/components/main/temas/gestionarTemas.css";
import Cargando from "../../utilities/Cargando";
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import ModalRegistrarSubtema from "./ModalRegistrarSubtema";
import ModalEditarSubtema from "./ModalEditarSubtema";
import Card from 'react-bootstrap/Card';
import Imagen from '../../../assets/images/crear.svg';


const GestionarSubtemas = () => {
  const [subtemas, setSubtemas] = useState([]);
  const { temaSeleccionado } = useTemaSeleccionado();
  const { subtemaSeleccionado, actualizarSubtemaSeleccionado } = useSubtemaSeleccionado();
  const [term, setTerm] = useState('');
  const [existeSubtemas, setExisteSubtemas] = useState(false);

  useEffect(() => {
    cargarSubtemas();
  }, [temaSeleccionado]);


  const cargarSubtemas = () => {
    axios
      .post("http://localhost:5000/subtemas/listarSubtemas", {
        idTema: temaSeleccionado.id,
      })
      .then((response) => {
        if (response.data.en === 1) {
          setSubtemas(response.data.subtemas);
          setExisteSubtemas(true);
        } else {
          console.log("Hubo un problema al cargar los subtemas");
          setExisteSubtemas(false);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los subtemas:", error);
      });
  };

  const activarDesactivarSubtema = () => {
    if (subtemaSeleccionado) {
      const nuevoEstado = subtemaSeleccionado.estado === 1 ? -1 : 1;
      axios
        .post("http://localhost:5000/subtemas/activarDesactivarSubtema", {
          id: subtemaSeleccionado.id,
          estado: nuevoEstado,
        })
        .then((response) => {
          if (response.data.en === 1) {
            cargarSubtemas();
          } else {
            console.log("No se pudo cambiar el estado del tema");
          }
        })
        .catch((error) => {
          console.error("Error al cambiar el estado del tema:", error);
        });
    }
  };

  const cleanHtmlTags = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.body.textContent || "";
  };

  const getButtonText = () => {
    if (subtemaSeleccionado === null) {
      return subtemas[0].estado === 1 ? "Desactivar" : "Activar";
    } else if (subtemaSeleccionado.estado === 1) {
      return "Desactivar";
    } else {
      return "Activar";
    }
  };

  const filteredSubtemas = term
    ? subtemas.filter(subtema =>
      subtema.titulo.toLowerCase().includes(term.toLowerCase())
    )
    : subtemas;


  return (
    <div>
      {existeSubtemas ? (
        subtemas.length > 0 ? (
          <div className="contenedorPrincipal">
            <div className="informacionTema">
              <h1>Subtemas</h1>
              <p>Los subtemas con fondo color rojo están desactivados</p>
              <p>Es necesario seleccionar un subtema para editar o para activar/desactivar.</p>

            </div>
            <div className="contenedorTabla">
              <Form.Group controlId="formBuscar">
                <Form.Control
                  type="text"
                  placeholder="Buscar subtema"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </Form.Group>
              <br />
              <table className="tablaTemas">
                <thead>
                  <tr>
                    <th className="tituloTabla">Subtemas existentes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubtemas.map((subtema, index) => (
                    <tr
                      key={index}
                      onClick={() => actualizarSubtemaSeleccionado(subtema)}
                      className={`
                ${subtema.estado === -1 ? "redRow" : ""}
                ${subtemaSeleccionado && subtemaSeleccionado.id === subtema.id
                          ? "selectedRow"
                          : ""
                        }
              `}
                    >
                      <td>{cleanHtmlTags(subtema.titulo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="botonesDerecha">
              <ModalRegistrarSubtema cargarSubtemas={cargarSubtemas} subtemas={subtemas} />
              <ModalEditarSubtema
                cargarSubtemas={cargarSubtemas}
                subtemaParaEditar={subtemaSeleccionado}
              />
              <Button
                variant="danger"
                className="botonActivarDesactivarTema"
                disabled={!subtemaSeleccionado}
                onClick={activarDesactivarSubtema}
              >
                {getButtonText()}
              </Button>
            </div>
          </div>
        ) : (
          <Cargando />
        )
      ) : (
        <div>
          <Card style={{ width: '18rem', marginTop: '75px', marginLeft: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card.Img variant="top" src={Imagen} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Card.Title>Da el primer paso: ¡Crea el primer subtema en este tema emocionante!</Card.Title>
              <Card.Text style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <ModalRegistrarSubtema cargarSubtemas={cargarSubtemas} subtemas={subtemas} />
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )
      }
    </div>
  );
};

export default GestionarSubtemas;