// import './App.css'
import PaginaPrincipal from '../src/components/main/PaginaPrincipal/PaginaPrincipal';
import PaginaInicio from './components/paginaInicio/PaginaInicio';
import { useSesionUsuario } from "../src/context/SesionUsuarioContext";
import { TemaSeleccionadoContextProvider } from "../src/context/TemaSeleccionadoContext";
import { SubtemaSeleccionadoContextProvider } from "../src/context/SubtemaSeleccionadoContext";
import { EjercicioSeleccionadoContextProvider } from "../src/context/EjercicioSeleccionadoContext";
import { PreguntaSeleccionadoContextProvider } from "../src/context/PreguntaSeleccionadoContext";
export default App
function App() {
  const { usuarioDetalles } = useSesionUsuario();
  return (
    <>
      <TemaSeleccionadoContextProvider>
        <SubtemaSeleccionadoContextProvider>
          <EjercicioSeleccionadoContextProvider>
            <PreguntaSeleccionadoContextProvider>
              {usuarioDetalles ? (
                <PaginaPrincipal />
              ) : (
                <PaginaInicio />
              )}
            </PreguntaSeleccionadoContextProvider>
          </EjercicioSeleccionadoContextProvider>
        </SubtemaSeleccionadoContextProvider>
      </TemaSeleccionadoContextProvider>
    </>
  );
}