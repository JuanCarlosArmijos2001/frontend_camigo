// import React, { useState, useContext, createContext, useEffect } from "react";
// import keycloak from "../config/keycloak";
// import axios from "axios";

// const SesionKeycloakContext = createContext();

// export const SesionKeycloakContextProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [usuarioDetallesKeycloak, setUsuarioDetallesKeycloak] = useState(null);
//     const [isInitialized, setIsInitialized] = useState(false);
//     const [tokenKeycloak, setTokenKeycloak] = useState(null);

//     useEffect(() => {
//         const initKeycloak = async () => {
//             if (!isInitialized) {
//                 try {
//                     const authenticated = await keycloak.init({
//                         onLoad: 'check-sso',
//                         silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
//                         checkLoginIframe: false,
//                         pkceMethod: 'S256'
//                     });

//                     if (authenticated) {
//                         console.log("AUTENTICADO ===============");
//                         setIsAuthenticated(true);
//                         console.log("AUTENTICADO TRUE ===============");
//                         console.log("VALOR TOKEN");
//                         console.log(keycloak.tokenParsed);
//                         const user = {
//                             username: keycloak.tokenParsed?.preferred_username,
//                             email: keycloak.tokenParsed?.email,
//                             tipoRol: keycloak.tokenParsed?.realm_access.roles.find(
//                                 rol => ["estudiante", "docente", "administrador"].includes(rol.toLowerCase())
//                             ) || "Sin rol definido",
//                             nombres: keycloak.tokenParsed?.given_name || "Sin nombre",
//                             apellidos: keycloak.tokenParsed?.family_name || "Sin apellido",
//                         };
//                         console.log("user: ", user);
//                         // Configurando el token
//                         // setTokenKeycloak({ token: user.token });

//                         console.log(user.token);
//                         const token = keycloak.token;
                        
//                         if (token) {
//                             console.log("HAY TOKEN");
//                             setTokenKeycloak({ token }); // Actualiza el estado
//                             localStorage.setItem("keycloakToken", token); // Almacena en localStorage
//                         } else {
//                             console.log("NO HAY TOKEN");
//                             console.error("El token de Keycloak no está disponible.");
//                         }

//                         console.log(tokenKeycloak);
//                         localStorage.setItem("keycloakToken", tokenKeycloak);
//                         comprobarExistenciaDeUsuarioInternoComoUsuarioInterno(user.nombres, user.apellidos, user.email, user.tipoRol);
//                     }
//                 } catch (error) {
//                     console.error('Error al inicializar Keycloak:', error);
//                 } finally {
//                     setIsInitialized(true);
//                 }
//             }
//         };

//         initKeycloak();
//     }, [isInitialized]);

//     const iniciarSesionKeycloak = () => {
//         keycloak.login({
//             redirectUri: window.location.origin
//         });
//     };

//     const cerrarSesionKeycloak = () => {
//         keycloak.logout({
//             redirectUri: window.location.origin
//         });
//     };

//     const value = {
//         isAuthenticated,
//         usuarioDetallesKeycloak,
//         iniciarSesionKeycloak,
//         cerrarSesionKeycloak
//     };



//     const registrarUsuarioAerobaseComoUsuarioExterno = async (nombres, apellidos, email, tipoRol) => {
//         console.log("nombres", nombres);
//         console.log("apellidos", apellidos);
//         console.log("email", email);
//         console.log("tipoRol", tipoRol);

//         try {
//             const response = await axios.post(
//                 `${HOST}/sesionUsuarioKeycloak/registrarUsuarioAerobaseComoUsuarioExterno`,
//                 { nombres, apellidos, email, tipoRol },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         version: '1.0.0',
//                     },
//                 }
//             );

//             const { en, m, tipoUsuario, userId } = response.data;

//             if (en === 1) {
//                 obtenerDetallesUsuarioAerobase(userId);
//                 console.log('Detalles del usuario obtenidos correctamente:', id, progreso, detallesPersona, detallesCuenta, detallesRol);
//             } else {
//                 console.error('Error al obtener detalles del usuario:', m);
//             }
//         } catch (error) {
//             console.error('Error en la petición para obtener detalles del usuario:', error);
//         }
//     };

//     const obtenerDetallesUsuarioAerobase = async (userId) => {
//         try {
//             const response = await axios.post(
//                 `${HOST}/sesionUsuarioKeycloak/obtenerDetallesUsuarioAerobase`,
//                 { userId },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         version: '1.0.0',
//                     },
//                 }
//             );

//             const { en, m, userId: idUsuario, progreso, detallesPersona, detallesCuenta, detallesRol } = response.data;
//             console.log("RESPONSE OBTENER: ", response.data);

//             if (en === 1) {
//                 setUsuarioDetallesKeycloak({ idUsuario, progreso, detallesPersona, detallesCuenta, detallesRol });
//                 console.log('Detalles del usuario obtenidos correctamente:', idUsuario, progreso, detallesPersona, detallesCuenta, detallesRol);
//             } else {
//                 console.error('Error al obtener detalles del usuario:', m);
//             }
//         } catch (error) {
//             console.error('Error en la petición para obtener detalles del usuario:', error);
//         }
//     };

//     const comprobarExistenciaDeUsuarioInternoComoUsuarioInterno = async (nombres, apellidos, email, tipoRol) => {
//         console.log("EMAIL: ", email)
//         console.log("TIPOROL ", tipoRol)
//         try {
//             const response = await axios.post(
//                 `${HOST}/sesionUsuarioKeycloak/comprobarExistenciaDeUsuarioInternoComoUsuarioInterno`,
//                 { email },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         version: '1.0.0',
//                     },
//                 }
//             );

//             const { en, tipoUsuario, userId, m } = response.data;
//             console.log("RESPONSE COMPROBAR: ", response);


//             if (en === 1) {
//                 console.log()
//                 if (!tipoUsuario) {
//                     console.log("REGISTRAR USUARIO AEROBASE")
//                     registrarUsuarioAerobaseComoUsuarioExterno(nombres, apellidos, email, tipoRol);
//                 } else {
//                     console.log("OBTENER DETALLES USUARIO AEROBASE")
//                     obtenerDetallesUsuarioAerobase(userId);
//                 }
//             } else {
//                 console.error('No se pudo validar la existencia de la cuenta:', m);
//             }
//         } catch (error) {
//             console.error('Error en la petición para validar la existencia de la cuenta:', error);
//         }
//     };

//     if (!isInitialized) {
//         return <div>Cargando...</div>;
//     }

//     return (
//         <SesionKeycloakContext.Provider value={value}>
//             {children}
//         </SesionKeycloakContext.Provider>
//     );
// };

// export const useSesionKeycloak = () => {
//     const context = useContext(SesionKeycloakContext);
//     if (!context) {
//         throw new Error('useSesionKeycloak debe ser usado dentro de un SesionKeycloakContextProvider');
//     }
//     return context;
// };
// ------------------------------------------------

import React, { useState, useContext, createContext, useEffect } from "react";
import keycloak from "../config/keycloak";
import axios from "axios";

const SesionKeycloakContext = createContext();

export const SesionKeycloakContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [usuarioDetallesKeycloak, setUsuarioDetallesKeycloak] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [tokenKeycloak, setTokenKeycloak] = useState(null);
    const HOST = import.meta.env.VITE_HOST;

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                const authenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
                    checkLoginIframe: false,
                    pkceMethod: 'S256'
                });
                console.log("--------OBJETO DE KEYCLOAK---------");
                console.log(authenticated);
                if (authenticated) {
                    const token = keycloak.token;
                    const user = {
                        username: keycloak.tokenParsed?.preferred_username,
                        email: keycloak.tokenParsed?.email,
                        tipoRol: keycloak.tokenParsed?.realm_access.roles.find(
                            rol => ["estudiante", "docente", "administrador"].includes(rol.toLowerCase())
                        ) || "Sin rol definido",
                        nombres: keycloak.tokenParsed?.given_name || "Sin nombre",
                        apellidos: keycloak.tokenParsed?.family_name || "Sin apellido",
                    };

                    // Almacenamiento persistente de token y usuario
                    if (token) {
                        localStorage.setItem("keycloakToken", token);
                        localStorage.setItem("keycloakUser", JSON.stringify(user));
                        
                        setIsAuthenticated(true);
                        setTokenKeycloak({ token });
                        
                        comprobarExistenciaDeUsuarioInternoComoUsuarioInterno(
                            user.nombres, 
                            user.apellidos, 
                            user.email, 
                            user.tipoRol
                        );
                    }
                } else {
                    // Intentar recuperar sesión desde localStorage
                    const storedToken = localStorage.getItem("keycloakToken");
                    const storedUser = localStorage.getItem("keycloakUser");
                    
                    if (storedToken && storedUser) {
                        const user = JSON.parse(storedUser);
                        setIsAuthenticated(true);
                        setTokenKeycloak({ token: storedToken });
                        
                        comprobarExistenciaDeUsuarioInternoComoUsuarioInterno(
                            user.nombres, 
                            user.apellidos, 
                            user.email, 
                            user.tipoRol
                        );
                    }
                }
            } catch (error) {
                console.error('Error al inicializar Keycloak:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        initKeycloak();
    }, []);

    const iniciarSesionKeycloak = () => {
        keycloak.login({
            redirectUri: window.location.origin
        });
    };

    const cerrarSesionKeycloak = () => {
        localStorage.removeItem("keycloakToken");
        localStorage.removeItem("keycloakUser");
        localStorage.removeItem("usuarioDetallesKeycloak");
        setIsAuthenticated(false);
        setUsuarioDetallesKeycloak(null);
        setTokenKeycloak(null);
        keycloak.logout({
            redirectUri: window.location.origin
        });
    };

    const registrarUsuarioAerobaseComoUsuarioExterno = async (nombres, apellidos, email, tipoRol) => {
        try {
            const response = await axios.post(
                `${HOST}/sesionUsuarioKeycloak/registrarUsuarioAerobaseComoUsuarioExterno`,
                { nombres, apellidos, email, tipoRol },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        version: '1.0.0',
                    },
                }
            );

            const { en, m, tipoUsuario, userId } = response.data;

            if (en === 1) {
                obtenerDetallesUsuarioAerobase(userId);
            } else {
                console.error('Error al obtener detalles del usuario:', m);
            }
        } catch (error) {
            console.error('Error en la petición para obtener detalles del usuario:', error);
        }
    };

    const obtenerDetallesUsuarioAerobase = async (userId) => {
        try {
            const response = await axios.post(
                `${HOST}/sesionUsuarioKeycloak/obtenerDetallesUsuarioAerobase`,
                { userId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        version: '1.0.0',
                    },
                }
            );

            const { en, m, userId: idUsuario, progreso, detallesPersona, detallesCuenta, detallesRol } = response.data;

            if (en === 1) {
                setUsuarioDetallesKeycloak({ idUsuario, progreso, detallesPersona, detallesCuenta, detallesRol });
                localStorage.setItem("usuarioDetallesKeycloak", JSON.stringify({ idUsuario, progreso, detallesPersona, detallesCuenta, detallesRol }));
                // console.log('Detalles del usuario obtenidos correctamente:', idUsuario, progreso, detallesPersona, detallesCuenta, detallesRol);
            } else {
                console.error('Error al obtener detalles del usuario:', m);
            }
        } catch (error) {
            console.error('Error en la petición para obtener detalles del usuario:', error);
        }
    };

    const comprobarExistenciaDeUsuarioInternoComoUsuarioInterno = async (nombres, apellidos, email, tipoRol) => {
        try {
            const response = await axios.post(
                `${HOST}/sesionUsuarioKeycloak/comprobarExistenciaDeUsuarioInternoComoUsuarioInterno`,
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        version: '1.0.0',
                    },
                }
            );

            const { en, tipoUsuario, userId, m } = response.data;

            if (en === 1) {
                if (!tipoUsuario) {
                    registrarUsuarioAerobaseComoUsuarioExterno(nombres, apellidos, email, tipoRol);
                } else {
                    obtenerDetallesUsuarioAerobase(userId);
                }
            } else {
                console.error('No se pudo validar la existencia de la cuenta:', m);
            }
        } catch (error) {
            console.error('Error en la petición para validar la existencia de la cuenta:', error);
        }
    };

    // Recuperar detalles de usuario desde localStorage al iniciar
    useEffect(() => {
        const storedDetails = localStorage.getItem("usuarioDetallesKeycloak");
        if (storedDetails) {
            try {
                const parsedDetails = JSON.parse(storedDetails);
                setUsuarioDetallesKeycloak(parsedDetails);
            } catch (error) {
                console.error('Error al parsear detalles de usuario:', error);
            }
        }
    }, []);

    const value = {
        isAuthenticated,
        usuarioDetallesKeycloak,
        iniciarSesionKeycloak,
        cerrarSesionKeycloak,
        tokenKeycloak
    };

    if (!isInitialized) {
        return <div>Cargando...</div>;
    }

    return (
        <SesionKeycloakContext.Provider value={value}>
            {children}
        </SesionKeycloakContext.Provider>
    );
};

export const useSesionKeycloak = () => {
    const context = useContext(SesionKeycloakContext);
    if (!context) {
        throw new Error('useSesionKeycloak debe ser usado dentro de un SesionKeycloakContextProvider');
    }
    return context;
};