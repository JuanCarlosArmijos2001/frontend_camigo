import Button from 'react-bootstrap/Button';
import Spinner from "react-bootstrap/Spinner";
import "../../assets/styles/components/utilities/cargando.css";

function Cargando() {
  return (
    <>
      <Button variant="danger" disabled>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span className="visually-hidden">Estamos teniendo problemas</span>
      </Button>{' '}
      <Button variant="danger" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Estamos teniendo problemas
      </Button>
    </>
  );
}

export default Cargando;