import React, { useState, useContext, createContext, useEffect } from "react";

const TemaSeleccionadoContext = createContext();

export const TemaSeleccionadoContextProvider = ({ children }) => {
    const [temaSeleccionado, setTemaSeleccionado] = useState(null);
    const actualizarTemaSeleccionado = (nuevoTemaSeleccionado) => {
        setTemaSeleccionado(nuevoTemaSeleccionado);
    };

    useEffect(() => {
        // console.log("Tema seleccionado en el contexto")
        // console.log(temaSeleccionado);
    }, [temaSeleccionado]);

    return (
        <TemaSeleccionadoContext.Provider value={{ temaSeleccionado, setTemaSeleccionado, actualizarTemaSeleccionado }}>
            {children}
        </TemaSeleccionadoContext.Provider>
    )
}

export const useTemaSeleccionado = () => {
    return useContext(TemaSeleccionadoContext);
}
