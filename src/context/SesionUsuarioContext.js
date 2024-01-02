
import React, { useState, useContext, createContext, useEffect } from "react";

const SesionUsuarioContext = createContext();

export const SesionUsuarioContextProvider = ({ children }) => {
    const [externalId, setExternalId] = useState(null);

    useEffect(() => {
        obtenerSesionUsuarioLocalStorage();
    }, []);

    const iniciarSesion = async (sesionUsuario) => {
        localStorage.setItem("external_id", sesionUsuario.external_id);
        setExternalId(sesionUsuario.external_id);
    };

    const cerrarSesion = () => {
        localStorage.removeItem("external_id");
        setExternalId(null);
    };

    const obtenerSesionUsuarioLocalStorage = () => {
        try {
            const externalId = localStorage.getItem("external_id");
            console.log("External ID obtenido del localStorage:", externalId);

            if (externalId) {
                setExternalId(externalId);
            }
        } catch (error) {
            console.error("Error al obtener el external_id del localStorage:", error);
        }
    };

    return (
        <SesionUsuarioContext.Provider
            value={{ externalId, iniciarSesion, cerrarSesion }}
        >
            {children}
        </SesionUsuarioContext.Provider>
    );
};

export const useSesionUsuario = () => {
    return useContext(SesionUsuarioContext);
};
