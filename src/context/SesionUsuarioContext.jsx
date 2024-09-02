import React, { useState, useContext, createContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const SesionUsuarioContext = createContext();

export const SesionUsuarioContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [usuarioDetalles, setUsuarioDetalles] = useState(null);
    

    useEffect(() => {
        obtenerTokenLocalStorage();
        verificarTiempoExpiracion();
        // Establecer un temporizador para verificar periódicamente
        const intervalId = setInterval(() => {
            verificarTiempoExpiracion();
            console.log("Verificando el tiempo de expiración del token...");
        }, 10000); // Verificar cada 10 segundos (ajusta el intervalo según tus necesidades)

        // Limpiar el temporizador al desmontar el componente
        return () => clearInterval(intervalId);
    }, []);

    const iniciarSesion = async (sesionUsuario) => {
        localStorage.setItem("token", sesionUsuario.token);
        // Decodificar el token solo cuando sea necesario, es decir, cuando se inicia sesión
        try {
            const decodedToken = jwtDecode(sesionUsuario.token);
            console.log("Token decodificado:", decodedToken);
            setToken(sesionUsuario.token);
            // Obtener detalles del usuario al iniciar sesión
            obtenerDetallesUsuario(decodedToken.userId);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            // Handle the error appropriately, e.g., clear the token and redirect to a login page.
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token"); // Elimina el token de localStorage al cerrar sesión
        setToken(null);
        setUsuarioDetalles(null); // Limpiar detalles del usuario al cerrar sesión
        console.log("Sesión cerrada correctamente");
    };

    const obtenerTokenLocalStorage = () => {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                console.log("Token decodificado:", decodedToken);
                const iatDate = new Date(decodedToken.iat * 1000).toLocaleString();
                const expDate = new Date(decodedToken.exp * 1000).toLocaleString();

                // Mostramos las fechas formateadas
                console.log("Tiempo de emisión:", iatDate);
                console.log("Tiempo de expiración:", expDate);

                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("El token ha expirado, inicia sesión nuevamente.");
                    cerrarSesion();
                } else {
                    setToken(token);
                    // Obtener detalles del usuario al cargar el token desde el localStorage
                    obtenerDetallesUsuario(decodedToken.userId);
                }
            }
        } catch (error) {
            console.error("Error al obtener el token del localStorage:", error);
        }
    };

    const verificarTiempoExpiracion = () => {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("El token ha expirado, inicia sesión nuevamente.");
                    cerrarSesion();
                }
            }
        } catch (error) {
            console.error("Error al verificar el tiempo de expiración del token:", error);
        }
    };

    const obtenerDetallesUsuario = async (userId) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/sesionUsuario/detalleSesion`,
                { userId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        version: '1.0.0',
                    },
                }
            );

            const { en, m, userId: id, progreso, detallesPersona, detallesCuenta, detallesRol } = response.data;

            if (en === 1) {
                setUsuarioDetalles({ id, progreso, detallesPersona, detallesCuenta, detallesRol });
                console.log('Detalles del usuario obtenidos correctamente:', id, progreso, detallesPersona, detallesCuenta, detallesRol);
            } else {
                console.error('Error al obtener detalles del usuario:', m);
            }
        } catch (error) {
            console.error('Error en la petición para obtener detalles del usuario:', error);
        }
    };


    return (
        <SesionUsuarioContext.Provider
            value={{ token, usuarioDetalles, setUsuarioDetalles, iniciarSesion, cerrarSesion }}
        >
            {children}
        </SesionUsuarioContext.Provider>
    );
};

export const useSesionUsuario = () => {
    return useContext(SesionUsuarioContext);
};

