// import React, { useEffect } from "react";
// import PaginaPrincipal from '../src/components/main/paginaPrincipal/PaginaPrincipal';
// import PaginaInicio from './components/paginaInicio/PaginaInicio';
// import { useSesionUsuario } from "../src/context/SesionUsuarioContext";
// import { useSesionKeycloak } from '../src/context/SesionKeycloakContext';
// import { TemaSeleccionadoContextProvider } from "../src/context/TemaSeleccionadoContext";
// import { SubtemaSeleccionadoContextProvider } from "../src/context/SubtemaSeleccionadoContext";
// import { EjercicioSeleccionadoContextProvider } from "../src/context/EjercicioSeleccionadoContext";
// import { PreguntaSeleccionadoContextProvider } from "../src/context/PreguntaSeleccionadoContext";

// export default function App() {
//   const { isAuthenticated, usuarioDetallesKeycloak } = useSesionKeycloak();
//   const { usuarioDetalles, setUsuarioDetalles } = useSesionUsuario();

//   console.log("Antes de setear usuarioDetalles");
//   console.log("isAuthenticated:", isAuthenticated);
//   console.log("usuarioDetallesKeycloak:", usuarioDetallesKeycloak);
//   console.log("usuarioDetalles actual:", usuarioDetalles);

//   // Transformar los datos de Keycloak al formato esperado por usuarioDetalles
//   useEffect(() => {
//     if (isAuthenticated && usuarioDetallesKeycloak && !usuarioDetalles) {
//       const transformedUserDetails = {
//         id: usuarioDetallesKeycloak.idUsuario,
//         progreso: usuarioDetallesKeycloak.progreso,
//         detallesPersona: usuarioDetallesKeycloak.detallesPersona,
//         detallesCuenta: usuarioDetallesKeycloak.detallesCuenta,
//         detallesRol: usuarioDetallesKeycloak.detallesRol
//       };

//       console.log("Transformando detalles de usuario:", transformedUserDetails);
//       setUsuarioDetalles(transformedUserDetails);
//       console.log("Después de setear usuarioDetalles");
//       console.log("usuarioDetalles actualizado:", transformedUserDetails);
//     }
//   }, [isAuthenticated, usuarioDetallesKeycloak, usuarioDetalles, setUsuarioDetalles]);

//   return (
//     <TemaSeleccionadoContextProvider>
//       <SubtemaSeleccionadoContextProvider>
//         <EjercicioSeleccionadoContextProvider>
//           <PreguntaSeleccionadoContextProvider>
//             {(isAuthenticated && usuarioDetallesKeycloak) || (usuarioDetalles) ? (
//               <PaginaPrincipal />
//             ) : (
//               <PaginaInicio />
//             )}
//           </PreguntaSeleccionadoContextProvider>
//         </EjercicioSeleccionadoContextProvider>
//       </SubtemaSeleccionadoContextProvider>
//     </TemaSeleccionadoContextProvider>
//   );
// }

// ------------------------------------------------------------------------------
// import React, { useEffect, useState } from "react";
// import PaginaPrincipal from '../src/components/main/paginaPrincipal/PaginaPrincipal';
// import PaginaInicio from './components/paginaInicio/PaginaInicio';
// import { useSesionUsuario } from "../src/context/SesionUsuarioContext";
// import { useSesionKeycloak } from '../src/context/SesionKeycloakContext';
// import { TemaSeleccionadoContextProvider } from "../src/context/TemaSeleccionadoContext";
// import { SubtemaSeleccionadoContextProvider } from "../src/context/SubtemaSeleccionadoContext";
// import { EjercicioSeleccionadoContextProvider } from "../src/context/EjercicioSeleccionadoContext";
// import { PreguntaSeleccionadoContextProvider } from "../src/context/PreguntaSeleccionadoContext";

// export default function App() {
//   const { 
//     isAuthenticated, 
//     usuarioDetallesKeycloak, 
//     tokenKeycloak 
//   } = useSesionKeycloak();

//   const { 
//     usuarioDetalles, 
//     setUsuarioDetalles 
//   } = useSesionUsuario();

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAndSetupSession = async () => {
//       // Verificar si hay token guardado en localStorage
//       const storedKeycloakToken = localStorage.getItem("keycloakToken");
//       const storedKeycloakUser = localStorage.getItem("keycloakUser");
//       const storedUserDetails = localStorage.getItem("usuarioDetallesKeycloak");

//       console.log("Stored Keycloak Token:", storedKeycloakToken);
//       console.log("Stored Keycloak User:", storedKeycloakUser);
//       console.log("Stored User Details:", storedUserDetails);

//       // Verificar si isAuthenticated es false pero hay token en localStorage
//       if (!isAuthenticated && storedKeycloakToken && storedKeycloakUser) {
//         try {
//           const parsedUser = JSON.parse(storedKeycloakUser);
//           const parsedUserDetails = storedUserDetails 
//             ? JSON.parse(storedUserDetails) 
//             : null;

//           // Transformar los datos de Keycloak al formato esperado por usuarioDetalles
//           if (parsedUserDetails) {
//             const transformedUserDetails = {
//               id: parsedUserDetails.idUsuario,
//               progreso: parsedUserDetails.progreso,
//               detallesPersona: parsedUserDetails.detallesPersona,
//               detallesCuenta: parsedUserDetails.detallesCuenta,
//               detallesRol: parsedUserDetails.detallesRol
//             };

//             console.log("Transformando detalles de usuario desde localStorage:", transformedUserDetails);
//             setUsuarioDetalles(transformedUserDetails);
//           }
//         } catch (error) {
//           console.error("Error al procesar datos almacenados:", error);
//         }
//       }

//       // Condición para verificar si hay datos de sesión válidos
//       const hasValidSession = 
//         (isAuthenticated && usuarioDetallesKeycloak) || 
//         (storedKeycloakToken && storedKeycloakUser);

//       setIsLoading(false);
//     };

//     checkAndSetupSession();
//   }, [isAuthenticated, usuarioDetallesKeycloak, setUsuarioDetalles]);

//   // Mostrar una pantalla de carga mientras se verifica la sesión
//   if (isLoading) {
//     return <div>Cargando...</div>;
//   }

//   return (
//     <TemaSeleccionadoContextProvider>
//       <SubtemaSeleccionadoContextProvider>
//         <EjercicioSeleccionadoContextProvider>
//           <PreguntaSeleccionadoContextProvider>
//             {(isAuthenticated && usuarioDetallesKeycloak) || (usuarioDetalles) ? (
//               <PaginaPrincipal />
//             ) : (
//               <PaginaInicio />
//             )}
//           </PreguntaSeleccionadoContextProvider>
//         </EjercicioSeleccionadoContextProvider>
//       </SubtemaSeleccionadoContextProvider>
//     </TemaSeleccionadoContextProvider>
//   );
// }

import React, { useEffect, useState } from "react";
import PaginaPrincipal from '../src/components/main/paginaPrincipal/PaginaPrincipal';
import PaginaInicio from './components/paginaInicio/PaginaInicio';
import { useSesionUsuario } from "../src/context/SesionUsuarioContext";
import { useSesionKeycloak } from '../src/context/SesionKeycloakContext';
import { TemaSeleccionadoContextProvider } from "../src/context/TemaSeleccionadoContext";
import { SubtemaSeleccionadoContextProvider } from "../src/context/SubtemaSeleccionadoContext";
import { EjercicioSeleccionadoContextProvider } from "../src/context/EjercicioSeleccionadoContext";
import { PreguntaSeleccionadoContextProvider } from "../src/context/PreguntaSeleccionadoContext";

export default function App() {
  const {
    isAuthenticated,
    usuarioDetallesKeycloak,
    tokenKeycloak
  } = useSesionKeycloak();

  const {
    usuarioDetalles,
    setUsuarioDetalles
  } = useSesionUsuario();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndSetupSession = async () => {
      // Verificar si hay token guardado en localStorage
      const storedKeycloakToken = localStorage.getItem("keycloakToken");
      const storedKeycloakUser = localStorage.getItem("keycloakUser");
      const storedUserDetails = localStorage.getItem("usuarioDetallesKeycloak");

      console.log("Stored Keycloak Token:", storedKeycloakToken);
      console.log("Stored Keycloak User:", storedKeycloakUser);
      console.log("Stored User Details:", storedUserDetails);

      // Verificar si isAuthenticated es false pero hay token en localStorage
      if ((!usuarioDetalles || !usuarioDetalles.detallesRol) &&
        storedKeycloakToken &&
        storedKeycloakUser &&
        storedUserDetails) {
        try {
          const parsedUser = JSON.parse(storedKeycloakUser);
          const parsedUserDetails = JSON.parse(storedUserDetails);

          console.log("Parsed User Details:", parsedUserDetails);

          // Transformar los datos de Keycloak al formato esperado por usuarioDetalles
          const transformedUserDetails = {
            id: parsedUserDetails.idUsuario,
            progreso: parsedUserDetails.progreso || null,
            detallesPersona: parsedUserDetails.detallesPersona || {},
            detallesCuenta: parsedUserDetails.detallesCuenta || {},
            detallesRol: parsedUserDetails.detallesRol || {
              tipoRol: parsedUser.tipoRol
            }
          };

          console.log("Transformando detalles de usuario desde localStorage:", transformedUserDetails);

          // Asegurarse de que tipoRol esté presente
          if (!transformedUserDetails.detallesRol.tipoRol) {
            transformedUserDetails.detallesRol.tipoRol = parsedUser.tipoRol;
          }

          setUsuarioDetalles(transformedUserDetails);
        } catch (error) {
          console.error("Error al procesar datos almacenados:", error);
        }
      }

      // Verificar si ya tenemos los detalles de Keycloak
      if (usuarioDetallesKeycloak) {
        const transformedUserDetails = {
          id: usuarioDetallesKeycloak.idUsuario,
          progreso: usuarioDetallesKeycloak.progreso,
          detallesPersona: usuarioDetallesKeycloak.detallesPersona,
          detallesCuenta: usuarioDetallesKeycloak.detallesCuenta,
          detallesRol: {
            ...usuarioDetallesKeycloak.detallesRol,
            tipoRol: usuarioDetallesKeycloak.detallesRol?.tipoRol ||
              JSON.parse(localStorage.getItem("keycloakUser"))?.tipoRol
          }
        };

        console.log("Transformando detalles de Keycloak:", transformedUserDetails);
        setUsuarioDetalles(transformedUserDetails);
      }

      setIsLoading(false);
    };

    checkAndSetupSession();
  }, [isAuthenticated, usuarioDetallesKeycloak, setUsuarioDetalles]);

  // Mostrar una pantalla de carga mientras se verifica la sesión
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <TemaSeleccionadoContextProvider>
      <SubtemaSeleccionadoContextProvider>
        <EjercicioSeleccionadoContextProvider>
          <PreguntaSeleccionadoContextProvider>
            {(isAuthenticated && usuarioDetallesKeycloak) || (usuarioDetalles) ? (
              <PaginaPrincipal />
            ) : (
              <PaginaInicio />
            )}
          </PreguntaSeleccionadoContextProvider>
        </EjercicioSeleccionadoContextProvider>
      </SubtemaSeleccionadoContextProvider>
    </TemaSeleccionadoContextProvider>
  );
}